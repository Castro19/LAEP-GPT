// scheduleBuilder.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchedScheduleBuilderLog,
  FetchedScheduleBuilderLogListItem,
  ConversationTurn,
  ScheduleBuilderMessage,
  ScheduleBuilderState,
  Section,
} from "@polylink/shared/types";
import {
  fetchAllLogsFromDB,
  fetchLogByThreadIdFromDB,
  deleteLogFromDB,
  streamScheduleBuilderRequest,
} from "./crudScheduleBuilderLog";
import { nanoid } from "@reduxjs/toolkit";
import {
  updateScheduleIdFromBuilder,
  updateScheduleSections,
} from "../schedule/scheduleSlice";

/* ------------------------------------------------------------------ */
/*  Local helper types                                                */
/* ------------------------------------------------------------------ */
interface ErrorPayload {
  message: string;
}

interface ScheduleBuilderLogState {
  currentScheduleChatId: string | null;
  logs: FetchedScheduleBuilderLogListItem[];
  currentLog: FetchedScheduleBuilderLog | null;
  draftMsg: string;
  loadingByThread: Record<string, boolean>;
  isLoading: boolean; // fetch lists / detail
  error: string | null;
  deletingThreadIds: string[];
  state: ScheduleBuilderState;
  scheduleSections: Section[];
}

const initialState: ScheduleBuilderLogState = {
  currentScheduleChatId: null,
  logs: [],
  currentLog: null,
  draftMsg: "",
  loadingByThread: {},
  isLoading: false,
  error: null,
  deletingThreadIds: [],
  state: {
    user_id: "",
    term: "fall2025",
    sections: [],
    user_query: "",
    schedule_id: "",
    diff: { added: [], removed: [] },
    preferences: { with_time_conflicts: true },
  },
  scheduleSections: [],
};

/* ------------------------------------------------------------------ */
/*  Thunks that already existed                                       */
/* ------------------------------------------------------------------ */
export const fetchAllLogs = createAsyncThunk<
  FetchedScheduleBuilderLogListItem[],
  void,
  { rejectValue: ErrorPayload }
>("scheduleBuilder/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await fetchAllLogsFromDB();
  } catch {
    return rejectWithValue({ message: "Failed to fetch logs" });
  }
});

export const fetchLogByThreadId = createAsyncThunk<
  FetchedScheduleBuilderLog,
  string,
  { rejectValue: ErrorPayload }
>("scheduleBuilder/fetchByThreadId", async (threadId, { rejectWithValue }) => {
  try {
    return await fetchLogByThreadIdFromDB(threadId);
  } catch {
    return rejectWithValue({ message: "Failed to fetch log" });
  }
});

export const deleteLog = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorPayload }
>("scheduleBuilder/delete", async (threadId, { dispatch, rejectWithValue }) => {
  try {
    await deleteLogFromDB(threadId);
    dispatch(fetchAllLogs());
    return threadId;
  } catch {
    return rejectWithValue({ message: "Failed to delete log" });
  }
});

/* ------------------------------------------------------------------ */
/*  ✨ NEW ✨  — unified chat / log thunk                               */
/* ------------------------------------------------------------------ */
const toSchedMsg = (obj: any): ScheduleBuilderMessage => {
  /* ---------------- role ---------------- */
  const kind = Array.isArray(obj.id) ? obj.id[2] : "";
  const role =
    kind === "HumanMessage"
      ? "user"
      : kind === "ToolMessage"
        ? "tool"
        : "assistant"; // default

  /* ---------------- tool_calls (AI only) ----------------
     They can be found in THREE spots depending on LangChain version:
     1. obj.tool_calls                           (top-level)
     2. obj.kwargs.tool_calls
     3. obj.kwargs.additional_kwargs.tool_calls
  */
  let rawCalls: any =
    obj.tool_calls ??
    obj.kwargs?.tool_calls ??
    obj.kwargs?.additional_kwargs?.tool_calls;

  // normalise undefined / empty
  if (!Array.isArray(rawCalls) || rawCalls.length === 0) rawCalls = undefined;

  const safeContent =
    typeof obj.kwargs?.content === "string"
      ? obj.kwargs.content
      : typeof obj.content === "string"
        ? obj.content
        : JSON.stringify(obj.kwargs?.content ?? obj.content ?? "");

  return {
    msg_id: obj.kwargs?.id || obj.id || nanoid(),
    role,
    msg: safeContent,
    state: obj.state,
    reaction: null,
    response_time: 0,
    tool_calls: role === "assistant" ? rawCalls : undefined,
  };
};

export const sendMessage = createAsyncThunk<
  void,
  { text: string; state: ScheduleBuilderState; placeholderTurnId: string },
  {
    state: { scheduleBuilderLog: ScheduleBuilderLogState };
    rejectValue: ErrorPayload;
  }
>(
  "scheduleBuilderLog/send",
  async (
    { text, state, placeholderTurnId },
    { getState, dispatch, rejectWithValue }
  ) => {
    const currentLog = getState().scheduleBuilderLog.currentLog;
    if (!currentLog) return rejectWithValue({ message: "No active log" });
    let threadId = currentLog.thread_id;

    // 1) now open the SSE stream
    try {
      await streamScheduleBuilderRequest(
        { threadId, userMsg: text, state },
        // on assistant chunk
        (chunk) => {
          dispatch(assistantChunkArrived({ placeholderTurnId, chunk }));
        },
        // on done
        (payload) => {
          // if new thread/schedule
          if (payload.isNewThread) {
            threadId = payload.threadId;
            dispatch(setScheduleChatId(threadId));
          }
          if (payload.isNewSchedule) {
            dispatch(updateScheduleIdFromBuilder(payload.schedule_id));
          }
          if (
            (payload.state.diff?.added &&
              payload.state.diff.added.length > 0) ||
            (payload.state.diff?.removed &&
              payload.state.diff.removed.length > 0)
          ) {
            dispatch(updateScheduleSections(payload.schedule.sections));
          }
          // full turn: massage LangChain JSON into your shape
          const parsedMsgs = payload.conversation.map(toSchedMsg);
          const fullTurn: ConversationTurn = {
            turn_id: placeholderTurnId,
            timestamp: new Date().toISOString(),
            messages: parsedMsgs,
            token_usage: {
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0,
            },
          };
          dispatch(
            turnComplete({
              placeholderTurnId,
              fullTurn,
              newState: payload.state,
            })
          );
        }
      );
    } catch (err: any) {
      return rejectWithValue({ message: err.message });
    }
  }
);

/* ------------------------------------------------------------------ */
/*  Slice                                                             */
/* ------------------------------------------------------------------ */
const scheduleBuilderLog = createSlice({
  name: "scheduleBuilderLog",
  initialState,
  reducers: {
    setDraftMsg: (st, a: PayloadAction<string>) => {
      st.draftMsg = a.payload;
    },
    appendUserTurnLocally: (st, a: PayloadAction<ConversationTurn>) => {
      if (!st.currentLog) return;
      st.currentLog.conversation_turns.push(a.payload);
    },
    clearError: (st) => {
      st.error = null;
    },
    clearCurrentLog: (st) => {
      st.currentLog = null;
    },
    setState: (st, a: PayloadAction<ScheduleBuilderState>) => {
      st.state = a.payload;
    },
    setScheduleChatId: (st, a: PayloadAction<string>) => {
      st.currentScheduleChatId = a.payload;
    },
    newScheduleChat: (st) => {
      st.currentScheduleChatId = nanoid();
      st.currentLog = {
        thread_id: `temp-${nanoid()}`,
        conversation_turns: [],
        title: "New Schedule Chat",
      };
    },
    // 1) incremental assistant stream
    assistantChunkArrived: (
      st,
      action: PayloadAction<{ placeholderTurnId: string; chunk: string }>
    ) => {
      const { placeholderTurnId, chunk } = action.payload;
      const turn = st.currentLog?.conversation_turns.find(
        (t) => t.turn_id === placeholderTurnId
      );
      if (!turn) return;
      // assume the last message in the turn is the assistant
      let aiMsg = turn.messages.find((m) => m.role === "assistant");
      if (!aiMsg) {
        // first assistant chunk: push an empty assistant message
        aiMsg = {
          msg_id: nanoid(),
          role: "assistant",
          msg: "",
          state: st.state,
          reaction: null,
          response_time: 0,
        };
        turn.messages.push(aiMsg);
      }
      aiMsg.msg += chunk;
    },

    // 2) finalization
    turnComplete: (
      st,
      action: PayloadAction<{
        placeholderTurnId: string;
        fullTurn: ConversationTurn;
        newState: ScheduleBuilderState;
      }>
    ) => {
      console.log("turnComplete: ", action.payload);
      const { placeholderTurnId, fullTurn, newState } = action.payload;

      // replace the placeholder turn
      const idx = st.currentLog!.conversation_turns.findIndex(
        (t) => t.turn_id === placeholderTurnId
      );
      if (idx !== -1) {
        st.currentLog!.conversation_turns[idx] = fullTurn;
      }

      // update the builder state
      st.state = newState;
      st.loadingByThread[st.currentLog!.thread_id] = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLogs.pending, (st) => {
        st.isLoading = true;
      })
      .addCase(fetchAllLogs.fulfilled, (st, a) => {
        st.logs = a.payload;
        st.isLoading = false;
      })
      .addCase(fetchAllLogs.rejected, (st, a) => {
        st.isLoading = false;
        st.error = a.payload?.message || "Failed";
      })
      .addCase(fetchLogByThreadId.pending, (st) => {
        st.isLoading = true;
      })
      .addCase(fetchLogByThreadId.fulfilled, (st, a) => {
        st.currentLog = a.payload;
        st.isLoading = false;
      })
      .addCase(fetchLogByThreadId.rejected, (st, a) => {
        st.isLoading = false;
        st.error = a.payload?.message || "Failed";
      })
      .addCase(deleteLog.pending, (st, a) => {
        st.deletingThreadIds.push(a.meta.arg);
      })
      .addCase(deleteLog.fulfilled, (st, a) => {
        st.deletingThreadIds = st.deletingThreadIds.filter(
          (id) => id !== a.payload
        );
      })
      .addCase(deleteLog.rejected, (st, a) => {
        st.deletingThreadIds = st.deletingThreadIds.filter(
          (id) => id !== a.meta.arg
        );
        st.error = a.payload?.message || "Failed";
      })
      .addCase(sendMessage.pending, (st) => {
        st.loadingByThread[st.currentLog!.thread_id] = true;
      })
      .addCase(sendMessage.rejected, (st, action) => {
        st.loadingByThread[st.currentLog!.thread_id] = false;
        st.error =
          action.payload?.message ??
          action.error.message ??
          "Failed to send message";
      });
  },
});

export const {
  setDraftMsg,
  appendUserTurnLocally,
  clearError,
  clearCurrentLog,
  setState,
  setScheduleChatId,
  newScheduleChat,
  assistantChunkArrived,
  turnComplete,
} = scheduleBuilderLog.actions;

export const scheduleBuilderLogReducer = scheduleBuilderLog.reducer;

/* ------------------------------------------------------------------ */
/*  Usage in a React component                                        */
/* ------------------------------------------------------------------ */
// dispatch(setDraftMsg(text));                      ← update textarea
// dispatch(appendUserTurnLocally(userTurn));         ← optimistic append
// dispatch(sendMessage({ text }));                   ← triggers backend
