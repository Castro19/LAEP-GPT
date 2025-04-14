import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import sendMessage, { cancelRun, sendUserReaction } from "./crudMessage";
// Types:
import {
  AssistantType,
  MessageObjType,
  MessageSliceType,
  ScheduleBuilderSection,
} from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";
import { handleToolUsageMarkers } from "./messageHelpers";

// Thunk for fetching the bot response. Performs READ operation by getting messages from the backend.
interface fetchBotResponseParams {
  currentModel: AssistantType;
  msg: string; //replace with formData
  currentChatId: string;
  userMessageId: string;
  botMessageId: string;
  sections: ScheduleBuilderSection[];
}
type SendMessageReturnType = {
  botMessage: MessageObjType;
  updateStream: (
    // eslint-disable-next-line no-unused-vars
    updateCallback: (arg0: string, arg1: string) => void
  ) => Promise<string>;
};

// return the currentChatId
export const fetchBotResponse = createAsyncThunk<
  { botMessage: MessageObjType; chatId: string }, // Modified return type
  fetchBotResponseParams,
  { rejectValue: { message: string; botMessageId: string; chatId: string } }
>(
  "message/fetchBotResponse",
  async (
    {
      currentModel,
      msg,
      currentChatId,
      userMessageId,
      botMessageId,
      sections,
    }: fetchBotResponseParams,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const newUserMessage = {
        id: userMessageId,
        sender: "user",
        text: msg, //form
        model: currentModel.title,
        userReaction: null,
        sections: sections,
      } as MessageObjType;

      if (msg.length === 0) {
        return rejectWithValue({
          message: "Message is empty",
          botMessageId,
          chatId: currentChatId,
        });
      }
      dispatch(
        addUserMessage({
          chatId: currentChatId,
          content: newUserMessage,
          assistantMongoId: currentModel.id,
        })
      ); // Dispatching to add user message to the state
      dispatch(toggleNewChat(false));

      dispatch(
        addBotMessage({
          chatId: currentChatId,
          content: {
            id: botMessageId,
            text: "",
            sender: "bot",
            userReaction: null,
            thinkingState: true,
            urlPhoto: currentModel.urlPhoto,
          },
          assistantMongoId: currentModel.id,
        })
      ); // Dispatching to add bot message to the state)
      const { botMessage, updateStream }: SendMessageReturnType =
        await sendMessage(
          currentModel,
          msg,
          currentChatId,
          userMessageId,
          botMessageId,
          sections
        );
      dispatch(
        updateThinkingState({
          id: botMessageId,
          thinkingState: false,
          chatId: currentChatId,
        })
      );
      // Streaming updates for the bot messages
      try {
        if (updateStream) {
          await updateStream((botMessageId: string, text: string) => {
            const updatedText = handleToolUsageMarkers(
              text,
              botMessageId,
              currentChatId,
              dispatch
            );
            dispatch(
              updateBotMessage({
                id: botMessageId,
                text: updatedText,
                chatId: currentChatId,
              })
            );
          });
        }
      } catch (streamError) {
        return rejectWithValue({
          message:
            "There was a problem streaming the response. Please try again later.",
          botMessageId,
          chatId: currentChatId,
        });
      }

      return { botMessage, chatId: currentChatId }; // Modified return
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue({
          message: error.message,
          botMessageId,
          chatId: currentChatId,
        });
      }
      return rejectWithValue({
        message: "An unknown error occurred",
        botMessageId,
        chatId: currentChatId,
      });
    }
  }
);

export const cancelBotResponse = createAsyncThunk(
  "message/cancelBotResponse",
  async (
    { userMessageId, chatId }: { userMessageId: string; chatId: string },
    { rejectWithValue }
  ) => {
    try {
      await cancelRun(userMessageId); // Cancelling the bot response
      return { chatId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error cancelling bot response:", error);
      }
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      }
      return rejectWithValue({ message: "An unknown error occurred" });
    }
  }
);

export const putUserReaction = createAsyncThunk(
  "message/putUserReaction",
  async (
    {
      logId,
      botMessageId,
      userReaction,
    }: {
      logId: string | null;
      botMessageId: string;
      userReaction: "like" | "dislike";
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      if (logId) {
        const result = await sendUserReaction(
          logId,
          botMessageId,
          userReaction
        );
        dispatch(
          updateUserReaction({
            id: botMessageId,
            userReaction,
            chatId: logId,
          })
        );
        return result;
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "An unknown error occurred" });
      }
    }
  }
);

const initialState: MessageSliceType = {
  currentChatId: null,
  isNewChat: true,
  messagesByChatId: {},
  msg: "",
  loading: {},
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Reducer to update the current message being typed
    updateMsg: (state, action: PayloadAction<string>) => {
      state.msg = action.payload;
    },
    // Reducer to add user or bot message to the state (CREATE)
    addUserMessage: (
      state,
      action: PayloadAction<{
        chatId: string;
        content: MessageObjType;
        assistantMongoId: string;
      }>
    ) => {
      const { chatId, content, assistantMongoId } = action.payload;
      if (!state.messagesByChatId[chatId]) {
        state.messagesByChatId[chatId] = {
          content: [],
          assistantMongoId: "",
        };
      }
      state.messagesByChatId[chatId] = {
        content: [...state.messagesByChatId[chatId].content, content],
        assistantMongoId: assistantMongoId,
      };
    },
    addBotMessage: (
      state,
      action: PayloadAction<{
        chatId: string;
        content: MessageObjType;
        assistantMongoId: string;
      }>
    ) => {
      const { chatId, content, assistantMongoId } = action.payload;
      if (!state.messagesByChatId[chatId]) {
        throw new Error("Chat log not found");
      }
      state.messagesByChatId[chatId] = {
        content: [...state.messagesByChatId[chatId].content, content],
        assistantMongoId: assistantMongoId,
      };
    },
    // Reducer to update an existing bot message in the state (UPDATE)
    updateBotMessage: (
      state,
      action: PayloadAction<{
        id: string;
        text: string;
        chatId: string;
      }>
    ) => {
      const { id, text, chatId } = action.payload;

      const message = state.messagesByChatId[chatId]?.content.find(
        (msg) => msg.id === id
      );
      if (message) {
        message.text = text;
      }
    },
    updateUserReaction: (
      state,
      action: PayloadAction<{
        id: string;
        userReaction: "like" | "dislike";
        chatId: string;
      }>
    ) => {
      const { id, userReaction, chatId } = action.payload;
      const message = state.messagesByChatId[chatId]?.content.find(
        (msg) => msg.id === id
      );
      if (message) {
        message.userReaction = userReaction;
      }
    },
    updateThinkingState: (
      state,
      action: PayloadAction<{
        id: string;
        thinkingState: boolean;
        chatId: string;
      }>
    ) => {
      const { id, thinkingState, chatId } = action.payload;
      const message = state.messagesByChatId[chatId]?.content.find(
        (msg) => msg.id === id
      );
      if (message) {
        message.thinkingState = thinkingState;
      }
    },
    setToolUsage: (
      state,
      action: PayloadAction<{
        id: string;
        toolUsage: string | null;
        chatId: string;
      }>
    ) => {
      const { id, toolUsage, chatId } = action.payload;
      const message = state.messagesByChatId[chatId]?.content.find(
        (msg) => msg.id === id
      );
      if (message) {
        message.toolUsage = toolUsage || undefined;
      }
    },

    // Reducer to set the entire message list (typically for initial load e.g. when a user selects a new log or new chat) (UPDATE)
    setMsgList: (
      state,
      action: PayloadAction<{
        chatId: string;
        content: MessageObjType[];
        assistantMongoId: string;
      }>
    ) => {
      const { chatId, content, assistantMongoId } = action.payload;
      state.messagesByChatId[chatId] = {
        content: content,
        assistantMongoId: assistantMongoId,
      };
    },
    // Reducer to clear the message list (DELETE)
    resetMsgList: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      delete state.messagesByChatId[chatId];
    },
    updateError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    // Reducer to clear the error state
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChatId(state, action: PayloadAction<string | null>) {
      state.currentChatId = action.payload;
    },
    toggleNewChat(state, action: PayloadAction<boolean>) {
      state.isNewChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBotResponse.pending, (state, action) => {
        const { currentChatId } = action.meta.arg; // Access from arg
        state.loading[currentChatId] = true;
      })
      .addCase(fetchBotResponse.fulfilled, (state, action) => {
        const { chatId } = action.payload;
        state.loading[chatId] = false;
      })
      .addCase(fetchBotResponse.rejected, (state, action) => {
        const chatId = action.payload?.chatId || action.meta.arg.currentChatId;
        state.loading[chatId] = false;
        state.error = action.payload?.message || "Unknown error";

        // Fix the botMessageId reference
        const botMessageId =
          action.payload?.botMessageId || action.meta.arg.botMessageId;
        if (botMessageId && chatId) {
          const message = state.messagesByChatId[chatId]?.content.find(
            (msg) => msg.id === botMessageId
          );
          if (message) {
            message.thinkingState = false;
          }
        }
      })
      .addCase(cancelBotResponse.fulfilled, (state, action) => {
        const { chatId } = action.payload;
        state.loading[chatId] = false;
      });
  },
});

export const {
  updateMsg,
  setMsgList,
  resetMsgList,
  addUserMessage,
  addBotMessage,
  updateBotMessage,
  updateUserReaction,
  updateThinkingState,
  updateError,
  clearError,
  setCurrentChatId,
  toggleNewChat,
  setToolUsage,
} = messageSlice.actions;

export const messageReducer = messageSlice.reducer;
