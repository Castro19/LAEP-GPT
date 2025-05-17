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
import { environment } from "@/helpers/getEnvironmentVars";
import { HumanMessage } from "@langchain/core/messages";
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
    userTurn: ConversationTurn;
    botTurn: ConversationTurn;
    threadId: string;
    isNewThread: boolean;
    isNewSchedule: boolean;
    scheduleId: string;
  },
  { text: string; state: ScheduleBuilderState },
  {
    state: { scheduleBuilderLog: ScheduleBuilderLogState };
    rejectValue: ErrorPayload;
  }
>(
  "scheduleBuilderLog/send",
  async ({ text, state }, { getState, rejectWithValue }) => {
    const { currentLog } = getState().scheduleBuilderLog;
    if (!currentLog) {
      return rejectWithValue({ message: "No active log loaded" });
    }

    const threadId = currentLog.thread_id;
    try {
      /* ---------------- optimistic user-turn ---------------- */
      const userTurn: ConversationTurn = {
        turn_id: nanoid(),
        timestamp: new Date(),
        token_usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
        messages: [
          {
            msg_id: nanoid(),
            role: "user",
            msg: text,
            state,
          } as ScheduleBuilderMessage,
        ],
      };

      // push it to the DB + invoke AI
      const response = await sendScheduleBuilderRequest({
        threadId,
        userMsg: text,
        state,
      });

      // Transform the response into a ConversationTurn
      const botTurn: ConversationTurn = {
        turn_id: nanoid(),
        timestamp: new Date(),
        token_usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
        messages: response.conversation.map((msg: any) => ({
          msg_id: nanoid(),
          role: msg instanceof HumanMessage ? "user" : "assistant",
          msg:
            typeof msg.content === "string"
              ? msg.content
              : JSON.stringify(msg.content),
          state: state,
          reaction: null,
          response_time: 0,
        })) as ScheduleBuilderMessage[],
      };

      return {
        userTurn,
        botTurn,
        threadId,
        isNewThread: response.isNewThread,
        isNewSchedule: response.isNewSchedule,
        scheduleId: response.scheduleId,
      };
    } catch (err) {
      if (environment === "dev") console.error(err);
      return rejectWithValue({ message: "Failed to send message" });
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
    b.addCase(sendMessage.pending, (st, a) => {
      const threadId = st.currentLog?.thread_id;
      if (threadId) st.loadingByThread[threadId] = true;
    });

    b.addCase(sendMessage.fulfilled, (st, a) => {
      const { botTurn, threadId, isNewThread, isNewSchedule, scheduleId } =
        a.payload;
      st.loadingByThread[threadId] = false;

      if (!st.currentLog) return;

      if (isNewThread) {
        st.logs.push({
          thread_id: threadId,
          title: "New Schedule Chat",
          updatedAt: new Date(),
        });
      }

      if (isNewSchedule && scheduleId) {
        // Update the scheduleId in the schedule slice
        st.state.schedule_id = scheduleId;
        // Dispatch the update to the schedule slice
        updateScheduleIdFromBuilder(scheduleId);
      }

      st.currentLog.conversation_turns.push(botTurn);
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
