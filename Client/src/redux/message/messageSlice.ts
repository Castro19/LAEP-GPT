import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import sendMessage, { cancelRun, sendUserReaction } from "./crudMessage";
// Types:
import {
  AssistantType,
  MessageObjType,
  MessageSliceType,
} from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";

// Thunk for fetching the bot response. Performs READ operation by getting messages from the backend.
interface fetchBotResponseParams {
  currentModel: AssistantType;
  file: File | null;
  msg: string; //replace with formData
  currentChatId: string | null;
  userId: string;
  userMessageId: string;
  botMessageId: string;
}
type SendMessageReturnType = {
  botMessage: MessageObjType;
  updateStream: (
    // eslint-disable-next-line no-unused-vars
    updateCallback: (arg0: string, arg1: string) => void
  ) => Promise<string>;
};

export const fetchBotResponse = createAsyncThunk<
  MessageObjType,
  fetchBotResponseParams,
  { rejectValue: { message: string; botMessageId: string } }
>(
  "message/fetchBotResponse",
  async (
    {
      currentModel,
      file: currentFile,
      msg,
      currentChatId,
      userId,
      userMessageId,
      botMessageId,
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
      } as MessageObjType;

      if (msg.length === 0) {
        return rejectWithValue({ message: "Message is empty", botMessageId });
      }
      dispatch(addUserMessage(newUserMessage)); // Dispatching to add user message to the state
      dispatch(toggleNewChat(false));

      dispatch(
        addBotMessage({
          id: botMessageId,
          text: "",
          sender: "bot",
          userReaction: null,
          thinkingState: true,
        })
      ); // Dispatching to add bot message to the state

      const { botMessage, updateStream }: SendMessageReturnType =
        await sendMessage(
          currentModel,
          currentFile,
          msg,
          currentChatId,
          userId,
          userMessageId,
          botMessageId
        );
      dispatch(updateThinkingState({ id: botMessageId, thinkingState: false }));
      // Streaming updates for the bot messages
      try {
        if (updateStream) {
          await updateStream((botMessageId: string, text: string) => {
            dispatch(updateBotMessage({ id: botMessageId, text })); // Updating existing bot message
          });
        } else {
          return rejectWithValue({
            message: "There was a problem streaming the response.",
            botMessageId,
          });
        }
      } catch (streamError) {
        return rejectWithValue({
          message:
            "There was a problem streaming the response. Please try again later.",
          botMessageId,
        });
      }

      return botMessage; // Returning the final state of the bot message
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message, botMessageId });
      }
      return rejectWithValue({
        message: "An unknown error occurred",
        botMessageId,
      });
    }
  }
);
// In your Redux actions file
export const cancelBotResponse = createAsyncThunk(
  "message/cancelBotResponse",
  async (userMessageId: string, { rejectWithValue }) => {
    try {
      await cancelRun(userMessageId); // Cancelling the bot response
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
        dispatch(updateUserReaction({ id: botMessageId, userReaction }));
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
  msgList: [],
  msg: "",
  isLoading: false,
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
    addUserMessage: (state, action: PayloadAction<MessageObjType>) => {
      state.msgList.push(action.payload);
    },
    addBotMessage: (state, action: PayloadAction<MessageObjType>) => {
      state.msgList.push(action.payload);
    },
    // Reducer to update an existing bot message in the state (UPDATE)
    updateBotMessage: (
      state,
      action: PayloadAction<{ id: string; text: string }>
    ) => {
      const message = state.msgList.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.text = action.payload.text;
      }
    },
    updateUserReaction: (
      state,
      action: PayloadAction<{ id: string; userReaction: "like" | "dislike" }>
    ) => {
      const message = state.msgList.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.userReaction = action.payload.userReaction;
      }
    },
    updateThinkingState: (
      state,
      action: PayloadAction<{ id: string; thinkingState: boolean }>
    ) => {
      const message = state.msgList.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.thinkingState = action.payload.thinkingState;
      }
    },
    // Reducer to set the entire message list (typically for initial load e.g. when a user selects a new log or new chat) (UPDATE)
    setMsgList: (state, action: PayloadAction<MessageObjType[]>) => {
      state.msgList = action.payload;
    },
    // Reducer to clear the message list (DELETE)
    resetMsgList: (state) => {
      state.msgList = [];
    },
    updateError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    // Reducer to clear the error state
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChatId(state, action: PayloadAction<string>) {
      state.currentChatId = action.payload;
    },
    toggleNewChat(state, action: PayloadAction<boolean>) {
      state.isNewChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBotResponse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBotResponse.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchBotResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Unknown error";
        // ensure that the bot message thinking state is reset
        if (action.payload?.botMessageId) {
          const message = state.msgList.find(
            (msg) => msg.id === action.payload?.botMessageId
          );
          if (message) {
            message.thinkingState = false;
          }
        }
      })
      .addCase(cancelBotResponse.fulfilled, (state) => {
        state.isLoading = false;
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
} = messageSlice.actions;

export const messageReducer = messageSlice.reducer;
