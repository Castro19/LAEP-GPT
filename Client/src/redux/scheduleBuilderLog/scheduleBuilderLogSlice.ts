// scheduleBuilder.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchedScheduleBuilderLog,
  FetchedScheduleBuilderLogListItem,
  ConversationTurn,
  ScheduleBuilderMessage,
  ScheduleBuilderState,
} from "@polylink/shared/types";
import {
  fetchAllLogsFromDB,
  fetchLogByThreadIdFromDB,
  deleteLogFromDB,
  sendScheduleBuilderRequest,
} from "./crudScheduleBuilderLog";
import { nanoid } from "@reduxjs/toolkit";
import { updateScheduleIdFromBuilder } from "../schedule/scheduleSlice";

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
export const sendMessage = createAsyncThunk<
  {
    fullTurn: ConversationTurn;
    placeholderTurnId: string;
    threadId: string;
    isNewThread: boolean;
    isNewSchedule: boolean;
  },
  { text: string; state: ScheduleBuilderState; placeholderTurnId: string },
  {
    state: { scheduleBuilderLog: ScheduleBuilderLogState };
    rejectValue: ErrorPayload;
  }
>(
  "scheduleBuilderLog/send",
  async ({ text, state, placeholderTurnId }, thunkAPI) => {
    const { getState, dispatch, rejectWithValue } = thunkAPI;
    const { currentLog } = getState().scheduleBuilderLog;

    if (!currentLog) {
      return rejectWithValue({ message: "No active log loaded" });
    }
    let currentThreadId = currentLog.thread_id;

    /* ---------- call backend ---------- */
    let response;
    try {
      response = await sendScheduleBuilderRequest({
        threadId: currentThreadId,
        userMsg: text,
        state,
      });
    } catch (err) {
      return rejectWithValue({
        message: "Failed to send schedule builder request",
      });
    }

    if (response.isNewThread) {
      currentThreadId = response.threadId;
    }

    /* ---------- forward schedule-id to schedule slice ---------- */
    if (response.scheduleId) {
      dispatch(updateScheduleIdFromBuilder(response.scheduleId));
    }
    /* ---------- parse LangChain JSON ---------- */
    const lcArr = response.conversation as any[];

    const toSchedMsg = (obj: any): ScheduleBuilderMessage => {
      const kind = Array.isArray(obj.id) ? obj.id[2] : "";
      const role =
        kind === "HumanMessage"
          ? "user"
          : kind === "ToolMessage"
            ? "tool"
            : "assistant";

      /* -------- grab tool calls regardless of where they sit -------- */
      const rawCalls =
        obj.tool_calls ??
        obj.kwargs?.additional_kwargs?.tool_calls ??
        undefined;
      const toolCalls =
        role === "assistant" && Array.isArray(rawCalls) && rawCalls.length
          ? rawCalls
          : undefined;

      return {
        msg_id: obj.kwargs?.id || obj.id || nanoid(),
        role,
        msg:
          typeof obj.kwargs?.content === "string"
            ? obj.kwargs.content
            : typeof obj.content === "string"
              ? obj.content
              : JSON.stringify(obj.kwargs?.content ?? obj.content ?? ""),
        state,
        reaction: null,
        response_time: 0,
        tool_calls: toolCalls,
      };
    };

    const parsedMsgs = lcArr.map(toSchedMsg);

    const fullTurn: ConversationTurn = {
      turn_id: placeholderTurnId,
      timestamp: new Date(),
      messages: parsedMsgs,
      token_usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };

    return {
      fullTurn,
      placeholderTurnId,
      threadId: currentThreadId,
      isNewThread: response.isNewThread,
      isNewSchedule: response.isNewSchedule,
    };
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
  },
  extraReducers: (b) => {
    /* list / detail thunks unchanged … */
    b.addCase(fetchAllLogs.pending, (st) => {
      st.isLoading = true;
    });
    b.addCase(fetchAllLogs.fulfilled, (st, a) => {
      st.logs = a.payload;
      st.isLoading = false;
    });
    b.addCase(fetchAllLogs.rejected, (st, a) => {
      st.isLoading = false;
      st.error = a.payload?.message || "Failed";
    });

    b.addCase(fetchLogByThreadId.pending, (st) => {
      st.isLoading = true;
    });
    b.addCase(fetchLogByThreadId.fulfilled, (st, a) => {
      st.currentLog = a.payload;
      st.isLoading = false;
    });
    b.addCase(fetchLogByThreadId.rejected, (st, a) => {
      st.isLoading = false;
      st.error = a.payload?.message || "Failed";
    });

    b.addCase(deleteLog.pending, (st, a) => {
      st.deletingThreadIds.push(a.meta.arg);
    });
    b.addCase(deleteLog.fulfilled, (st, a) => {
      st.deletingThreadIds = st.deletingThreadIds.filter(
        (id) => id !== a.payload
      );
    });
    b.addCase(deleteLog.rejected, (st, a) => {
      st.deletingThreadIds = st.deletingThreadIds.filter(
        (id) => id !== a.meta.arg
      );
      st.error = a.payload?.message || "Failed";
    });

    /* ----- chat integration  ----- */
    b.addCase(sendMessage.pending, (st) => {
      const threadId = st.currentLog?.thread_id;
      if (threadId) st.loadingByThread[threadId] = true;
    });

    b.addCase(sendMessage.fulfilled, (st, a) => {
      const { fullTurn, placeholderTurnId, threadId, isNewThread } = a.payload;
      st.loadingByThread[threadId] = false;

      if (!st.currentLog) return;

      if (isNewThread) {
        st.logs.push({
          thread_id: threadId,
          title: "New Schedule Chat",
          updatedAt: new Date(),
        });
      }

      const turns = st.currentLog.conversation_turns;
      const idx = turns.findIndex((t) => t.turn_id === placeholderTurnId);

      if (idx !== -1) {
        turns[idx] = fullTurn; // overwrite placeholder with real data
      } else {
        turns.push(fullTurn); // fallback (shouldn't happen)
      }
    });

    b.addCase(sendMessage.rejected, (st, a) => {
      const threadId = st.currentLog?.thread_id;
      if (threadId) st.loadingByThread[threadId] = false;
      st.error =
        (a.payload as ErrorPayload)?.message || "Failed to send message";
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
} = scheduleBuilderLog.actions;

export const scheduleBuilderLogReducer = scheduleBuilderLog.reducer;

/* ------------------------------------------------------------------ */
/*  Usage in a React component                                        */
/* ------------------------------------------------------------------ */
// dispatch(setDraftMsg(text));                      ← update textarea
// dispatch(appendUserTurnLocally(userTurn));         ← optimistic append
// dispatch(sendMessage({ text }));                   ← triggers backend
