// scheduleBuilder.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchedScheduleBuilderLog,
  FetchedScheduleBuilderLogListItem,
  ConversationTurn,
  ScheduleBuilderMessage,
  ScheduleBuilderState,
  ToolCall,
  CourseTerm,
  SelectedSection,
} from "@polylink/shared/types";
import {
  fetchAllLogsFromDB,
  fetchLogByThreadIdFromDB,
  deleteLogFromDB,
  streamScheduleBuilderRequest,
  updateLogTitleFromDB,
  fetchPotentialSectionsFromDB,
} from "./crudScheduleBuilderLog";
import { nanoid } from "@reduxjs/toolkit";
import {
  updateScheduleIdFromBuilder,
  updateScheduleSections,
  updateScheduleSection,
} from "../schedule/scheduleSlice";
import { updateSelectedSections } from "../sectionSelection/sectionSelectionSlice";

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
  messagePending: string | null;
  isLoading: boolean; // fetch lists / detail
  error: string | null;
  deletingThreadIds: string[];
  currentToolCalls: ToolCall[] | null;
  currentAssistantMsg: ScheduleBuilderMessage | null;
}

const initialState: ScheduleBuilderLogState = {
  currentScheduleChatId: null,
  logs: [],
  currentLog: null,
  draftMsg: "",
  loadingByThread: {},
  messagePending: null,
  isLoading: false,
  error: null,
  deletingThreadIds: [],
  currentToolCalls: [],
  currentAssistantMsg: null,
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
    let threadId = currentLog?.thread_id ?? `temp-${nanoid()}`;

    try {
      await streamScheduleBuilderRequest(
        { threadId, userMsg: text, state },
        // on assistant chunk
        (chunk) => {
          dispatch(assistantChunkArrived({ placeholderTurnId, chunk }));
        },
        // on message
        (msg) => {
          dispatch(receivedMessage({ placeholderTurnId, message: msg }));
        },
        // on tool call
        (calls) => {
          dispatch(receivedToolCalls({ placeholderTurnId, calls }));
          // Process tool calls immediately
          if (Array.isArray(calls)) {
            dispatch(processToolCalls(calls));
          }
        },
        // on tool call msg
        (toolMsgs) => {
          dispatch(receivedToolCallMsgs({ placeholderTurnId, toolMsgs }));
        },
        // on done
        (payload) => {
          if (payload.isNewThread) {
            threadId = payload.threadId;
            dispatch(setScheduleChatId(threadId));
          }
          if (payload.isNewSchedule) {
            dispatch(updateScheduleIdFromBuilder(payload.schedule_id));
          }
          if (payload.selectedSections) {
            dispatch(updateSelectedSections(payload.selectedSections));
          }
          if (
            (payload.state.diff?.added &&
              payload.state.diff.added.length > 0) ||
            (payload.state.diff?.removed &&
              payload.state.diff.removed.length > 0)
          ) {
            dispatch(
              updateScheduleSections(payload.state.currentSchedule.sections)
            );
          }
          dispatch(turnComplete());
        }
      );
    } catch (err: Error | unknown) {
      return rejectWithValue({
        message:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }
);

export const updateLogTitle = createAsyncThunk<
  { threadId: string; title: string },
  { threadId: string; title: string },
  { rejectValue: ErrorPayload }
>(
  "scheduleBuilder/updateTitle",
  async ({ threadId, title }, { dispatch, rejectWithValue }) => {
    try {
      await updateLogTitleFromDB(threadId, title);
      dispatch(fetchAllLogs()); // Refresh the logs list to get updated title
      return { threadId, title };
    } catch {
      return rejectWithValue({ message: "Failed to update log title" });
    }
  }
);

// Create a thunk to handle tool calls
export const processToolCalls = createAsyncThunk(
  "scheduleBuilderLog/processToolCalls",
  async (toolCalls: ToolCall[], { dispatch }) => {
    // Process each tool call
    for (const toolCall of toolCalls) {
      switch (toolCall.name) {
        case "manage_schedule": {
          const args = toolCall.args as {
            operation: string;
            class_nums?: number[];
          };
          if (args.operation === "add" && args.class_nums) {
            await dispatch(
              updateScheduleSection({
                sectionIds: args.class_nums,
                action: "add",
              })
            );
          } else if (args.operation === "remove" && args.class_nums) {
            await dispatch(
              updateScheduleSection({
                sectionIds: args.class_nums,
                action: "remove",
              })
            );
          }
          break;
        }
        // Add other tool call types as needed
      }
    }
  }
);

export const fetchSelectedSectionsByClassNumbers = createAsyncThunk<
  SelectedSection[],
  { term: CourseTerm; classNumbers: number[] },
  { rejectValue: ErrorPayload }
>(
  "scheduleBuilder/fetchSelectedSectionsByClassNumbers",
  async ({ term, classNumbers }, { rejectWithValue }) => {
    try {
      return await fetchPotentialSectionsFromDB(term, classNumbers);
    } catch (error) {
      return rejectWithValue({
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch selected sections",
      });
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
    setScheduleChatId: (st, a: PayloadAction<string>) => {
      st.currentScheduleChatId = a.payload;
      if (st.currentLog) {
        st.currentLog.thread_id = a.payload;
      }
    },
    newScheduleChat: (st) => {
      st.currentScheduleChatId = `temp-${nanoid()}`;
      st.currentLog = {
        thread_id: `temp-${nanoid()}`,
        conversation_turns: [],
        title: "New Schedule Chat",
      };
    },
    receivedToolCalls: (
      st,
      action: PayloadAction<{
        placeholderTurnId: string;
        calls: ToolCall[] | string;
      }>
    ) => {
      const { placeholderTurnId, calls } = action.payload;
      const turn = st.currentLog?.conversation_turns.find(
        (t) => t.turn_id === placeholderTurnId
      );

      if (!turn) return;

      const aiMsg = turn.messages.find((m) => m.role === "assistant");
      if (!aiMsg) return;

      // If calls is a string, try to parse it as JSON
      if (typeof calls === "string") {
        try {
          const parsedCalls = JSON.parse(calls);
          if (Array.isArray(parsedCalls)) {
            // For arrays, only add new tool calls that don't already exist
            const existingIds = new Set(
              aiMsg.tool_calls?.map((tc) => tc.id) || []
            );
            const newCalls = parsedCalls.filter(
              (tc) => !existingIds.has(tc.id)
            );
            if (newCalls.length > 0) {
              aiMsg.tool_calls = [...(aiMsg.tool_calls || []), ...newCalls];
            }
          }
        } catch (e) {
          // If parsing fails, treat it as a streaming chunk
          if (!aiMsg.tool_call_chunks) {
            aiMsg.tool_call_chunks = [];
          }
          aiMsg.tool_call_chunks.push(calls);
        }
      } else {
        // For complete tool calls array, only add new ones
        const existingIds = new Set(aiMsg.tool_calls?.map((tc) => tc.id) || []);
        const newCalls = calls.filter((tc) => !existingIds.has(tc.id));
        if (newCalls.length > 0) {
          const newToolCalls = [...(aiMsg.tool_calls || []), ...newCalls];
          aiMsg.tool_calls = newToolCalls;
          st.currentToolCalls = aiMsg.tool_calls;
        }
      }
    },
    receivedToolCallMsgs: (
      st,
      action: PayloadAction<{ placeholderTurnId: string; toolMsgs: string }>
    ) => {
      const { placeholderTurnId, toolMsgs } = action.payload;
      const turn = st.currentLog?.conversation_turns.find(
        (t) => t.turn_id === placeholderTurnId
      );
      if (!turn) return;

      const aiMsg = turn.messages.find((m) => m.role === "assistant");
      if (!aiMsg) return;

      if (!aiMsg.toolMessages) {
        aiMsg.toolMessages = [];
      }
      aiMsg.toolMessages.push({
        msg_id: nanoid(),
        msg: toolMsgs,
      });
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

      // Find the assistant message (should exist from pending)
      const aiMsg = turn.messages.find((m) => m.role === "assistant");
      if (!aiMsg) return; // should never happen due to pending

      if (aiMsg.isPending && aiMsg.msg === "Analyzing request...") {
        aiMsg.msg = chunk;
        aiMsg.isPending = false;
      } else {
        // Append the chunk
        aiMsg.msg += chunk;
      }
      st.currentToolCalls = null;
      st.currentAssistantMsg = aiMsg;
    },
    // 2) received a complete message
    receivedMessage: (
      st,
      {
        payload: { placeholderTurnId, message },
      }: PayloadAction<{
        placeholderTurnId: string;
        message: ScheduleBuilderMessage;
      }>
    ) => {
      const turn = st.currentLog?.conversation_turns.find(
        (t) => t.turn_id === placeholderTurnId
      );
      if (!turn) return;

      // 1) If this is an assistant message, merge into the placeholder
      if (message.role === "assistant") {
        // find the existing assistant bubble
        const aiMsg = turn.messages.find((m) => m.role === "assistant");
        if (aiMsg) {
          // overwrite its text (it's been collecting via assistantChunkArrived)
          aiMsg.msg = message.msg;
          // copy over token_usage etc. if you need it
          aiMsg.token_usage = message.token_usage;
          aiMsg.finish_reason = message.finish_reason;
          aiMsg.model_name = message.model_name;
          aiMsg.system_fingerprint = message.system_fingerprint;
          return;
        }
        // if no placeholder (shouldn't happen) just push it
        turn.messages.push(message);
        return;
      }

      // 2) If it's a tool message, push it *into* the assistant bubble
      if (message.role === "tool") {
        let aiMsg = turn.messages.find((m) => m.role === "assistant");
        if (!aiMsg) {
          // no assistant yet? push a blank one first
          const blank: ScheduleBuilderMessage = {
            msg_id: nanoid(),
            role: "assistant",
            msg: "",
            reaction: null,
            response_time: 0,
          };
          turn.messages.push(blank);
          aiMsg = blank;
        }
        // now stash this tool's plain text in a helper array on the assistant
        if (!aiMsg.toolMessages) {
          aiMsg.toolMessages = [];
        }
        aiMsg.toolMessages.push({
          msg_id: message.msg_id,
          msg: message.msg,
        });
        return;
      }

      // 3) ignore user messages here (you already optimistically appended them)
    },

    // 4) finalization
    turnComplete: (st) => {
      // update the builder state
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
      .addCase(sendMessage.pending, (st, action) => {
        const { placeholderTurnId } = action.meta.arg;
        // mark loading
        st.loadingByThread[st.currentLog!.thread_id] = true;
        // Clear the current assistant message
        st.currentAssistantMsg = null;

        // find the turn we already optimistically added (with only the user msg)
        const turn = st.currentLog?.conversation_turns.find(
          (t) => t.turn_id === placeholderTurnId
        );
        if (!turn) return;

        // immediately append a blank assistant msg
        turn.messages.push({
          msg_id: nanoid(),
          role: "assistant",
          msg: "Analyzing request...", // will fill in onChunk / receivedMessage
          reaction: null,
          response_time: 0,
          isPending: true,
        });
      })
      .addCase(sendMessage.rejected, (st, action) => {
        const threadId = st.currentLog!.thread_id;
        st.loadingByThread[threadId] = false;
        st.error =
          action.payload?.message ??
          action.error.message ??
          "Failed to send message";
      })
      .addCase(updateLogTitle.pending, (st, a) => {
        st.loadingByThread[a.meta.arg.threadId] = true;
      })
      .addCase(updateLogTitle.fulfilled, (st, a) => {
        st.loadingByThread[a.payload.threadId] = false;
        // Update the title in the logs list
        const log = st.logs.find((l) => l.thread_id === a.payload.threadId);
        if (log) {
          log.title = a.payload.title;
        }
      })
      .addCase(updateLogTitle.rejected, (st, a) => {
        st.loadingByThread[a.meta.arg.threadId] = false;
        st.error = a.payload?.message || "Failed to update title";
      });
  },
});

export const {
  setDraftMsg,
  appendUserTurnLocally,
  clearError,
  clearCurrentLog,
  setScheduleChatId,
  newScheduleChat,
  assistantChunkArrived,
  receivedMessage,
  receivedToolCalls,
  receivedToolCallMsgs,
  turnComplete,
} = scheduleBuilderLog.actions;

export const scheduleBuilderLogReducer = scheduleBuilderLog.reducer;
