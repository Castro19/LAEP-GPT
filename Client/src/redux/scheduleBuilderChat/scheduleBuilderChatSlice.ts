import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ConversationTurn,
  ScheduleBuilderMessage,
  ScheduleBuilderSection,
} from "@polylink/shared/types";

interface ScheduleBuilderChatState {
  currentScheduleChatId: string | null;
  messagesByChatId: {
    [key: string]: {
      content: ConversationTurn[];
    };
  };
  msg: string;
  loading: { [key: string]: boolean };
  error: string | null;
}

const initialState: ScheduleBuilderChatState = {
  currentScheduleChatId: null,
  messagesByChatId: {},
  msg: "",
  loading: {},
  error: null,
};

interface ErrorPayload {
  message: string;
  botMessageId: string;
  chatId: string;
}

// Async thunk for schedule builder specific chat
export const fetchScheduleBuilderResponse = createAsyncThunk<
  { turn: ConversationTurn; chatId: string },
  {
    msg: string;
    currentScheduleChatId: string;
    userMessageId: string;
    botMessageId: string;
    sections: ScheduleBuilderSection[];
    scheduleId: string;
  },
  { rejectValue: ErrorPayload }
>(
  "scheduleBuilderChat/fetchResponse",
  async (
    { msg, currentScheduleChatId, userMessageId, botMessageId, scheduleId },
    { rejectWithValue }
  ) => {
    try {
      console.log("Fetching schedule builder response with:", {
        msg,
        currentScheduleChatId,
        userMessageId,
        botMessageId,
        scheduleId,
      });

      // TODO: Implement the actual API call
      // This is a placeholder for now
      const botTurn: ConversationTurn = {
        turn_id: botMessageId,
        timestamp: new Date(),
        messages: [
          {
            msg_id: botMessageId,
            role: "assistant" as const,
            msg: "Schedule builder response",
          },
        ],
      };

      console.log("Created bot turn:", botTurn);

      return {
        turn: botTurn,
        chatId: currentScheduleChatId,
      };
    } catch (error) {
      console.error("Error in fetchScheduleBuilderResponse:", error);
      return rejectWithValue({
        message: error instanceof Error ? error.message : "Unknown error",
        botMessageId,
        chatId: currentScheduleChatId,
      });
    }
  }
);

const scheduleBuilderChatSlice = createSlice({
  name: "scheduleBuilderChat",
  initialState,
  reducers: {
    updateMsg: (state, action: PayloadAction<string>) => {
      state.msg = action.payload;
    },
    setCurrentScheduleChatId: (state, action: PayloadAction<string | null>) => {
      state.currentScheduleChatId = action.payload;
    },
    toggleNewChat: (state) => {
      state.currentScheduleChatId = null;
    },
    addTurn: (
      state,
      action: PayloadAction<{
        chatId: string;
        turn: ConversationTurn;
      }>
    ) => {
      const { chatId, turn } = action.payload;
      console.log("Adding turn to state:", { chatId, turn });

      if (!state.messagesByChatId[chatId]) {
        state.messagesByChatId[chatId] = {
          content: [],
        };
      }
      state.messagesByChatId[chatId] = {
        content: [...state.messagesByChatId[chatId].content, turn],
      };
      console.log("Updated state:", state.messagesByChatId[chatId]);
    },
    updateTurn: (
      state,
      action: PayloadAction<{
        chatId: string;
        turnId: string;
        messages: ScheduleBuilderMessage[];
      }>
    ) => {
      const { chatId, turnId, messages } = action.payload;
      const turn = state.messagesByChatId[chatId]?.content.find(
        (t) => t.turn_id === turnId
      );
      if (turn) {
        turn.messages = messages;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduleBuilderResponse.pending, (state, action) => {
        const { currentScheduleChatId } = action.meta.arg;
        state.loading[currentScheduleChatId] = true;
        console.log("Fetch response pending for chat:", currentScheduleChatId);
      })
      .addCase(fetchScheduleBuilderResponse.fulfilled, (state, action) => {
        const { chatId, turn } = action.payload;
        state.loading[chatId] = false;
        console.log("Fetch response fulfilled:", { chatId, turn });

        // Add the bot's turn to the chat
        if (!state.messagesByChatId[chatId]) {
          state.messagesByChatId[chatId] = {
            content: [],
          };
        }
        state.messagesByChatId[chatId].content.push(turn);
        console.log(
          "Updated state after bot response:",
          state.messagesByChatId[chatId]
        );
      })
      .addCase(fetchScheduleBuilderResponse.rejected, (state, action) => {
        const chatId =
          action.payload?.chatId || action.meta.arg.currentScheduleChatId;
        state.loading[chatId] = false;
        state.error = action.payload?.message || "Unknown error";
        console.error("Fetch response rejected:", {
          chatId,
          error: state.error,
        });
      });
  },
});

export const {
  updateMsg,
  setCurrentScheduleChatId,
  toggleNewChat,
  addTurn,
  updateTurn,
  clearError,
} = scheduleBuilderChatSlice.actions;

export const scheduleBuilderChatActions = {
  updateMsg,
  setCurrentScheduleChatId,
  toggleNewChat,
  addTurn,
  updateTurn,
  clearError,
  fetchScheduleBuilderResponse,
};

export const scheduleBuilderChatReducer = scheduleBuilderChatSlice.reducer;
