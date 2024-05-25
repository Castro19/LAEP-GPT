import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import sendMessage from "./handleMessage";
// Types:
import {
  ModelType,
  MessageObjType,
  SendMessageReturnType,
  MessageSliceType,
} from "@/types";

// Thunk for fetching the bot response. Performs READ operation by getting messages from the backend.
interface fetchBotResponseParams {
  currentModel: ModelType;
  msg: string;
  currentChatId: string | null;
}
export const fetchBotResponse = createAsyncThunk<
  MessageObjType,
  fetchBotResponseParams,
  { rejectValue: { message: string } }
>(
  "message/fetchBotResponse",
  async (
    { currentModel, msg, currentChatId }: fetchBotResponseParams,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const {
        newUserMessage,
        botMessage,
        updateStream,
      }: SendMessageReturnType = await sendMessage(
        currentModel,
        msg,
        currentChatId
      );
      dispatch(addUserMessage(newUserMessage)); // Dispatching to add user message to the state

      dispatch(addUserMessage(botMessage)); // Dispatching to add bot message to the state

      // Streaming updates for the bot messages
      await updateStream((botMessageId: number, text: string) => {
        dispatch(updateBotMessage({ id: botMessageId, text })); // Updating existing bot message
      });

      return botMessage; // Returning the final state of the bot message
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        // Handle non-error objects if needed
        return rejectWithValue({ message: "An unknown error occurred" });
      }
    }
  }
);

const initialState: MessageSliceType = {
  currentChatId: null,
  isNewChat: true,
  msgList: [],
  isLoading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Reducer to add user or bot message to the state (CREATE)
    addUserMessage: (state, action: PayloadAction<MessageObjType>) => {
      state.msgList.push(action.payload);
    },
    // Reducer to update an existing bot message in the state (UPDATE)
    updateBotMessage: (
      state,
      action: PayloadAction<{ id: number; text: string }>
    ) => {
      const message = state.msgList.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.text = action.payload.text;
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
      .addCase(
        fetchBotResponse.rejected,
        (state, action: PayloadAction<{ message: string } | undefined>) => {
          state.isLoading = false;
          state.error = action.payload?.message || "Unknown error";
        }
      );
  },
});

export const {
  setMsgList,
  resetMsgList,
  addUserMessage,
  updateBotMessage,
  clearError,
  setCurrentChatId,
  toggleNewChat,
} = messageSlice.actions;

export const messageReducer = messageSlice.reducer;
