import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import sendMessage from "./crudMessage";
// Types:
import { ModelType, MessageObjType, MessageSliceType } from "@/types";
import { updateLog } from "../log/logSlice";

// Thunk for fetching the bot response. Performs READ operation by getting messages from the backend.
interface fetchBotResponseParams {
  currentModel: ModelType;
  file: File | null;
  msg: string; //replace with formData
  currentChatId: string | null;
}
type SendMessageReturnType = {
  newUserMessage: MessageObjType;
  botMessage: MessageObjType;
  updateStream: (
    // eslint-disable-next-line no-unused-vars
    updateCallback: (arg0: number, arg1: string) => void
  ) => Promise<string>;
};

export const fetchBotResponse = createAsyncThunk<
  MessageObjType,
  fetchBotResponseParams,
  { rejectValue: { message: string } }
>(
  "message/fetchBotResponse",
  async (
    { currentModel, file, msg, currentChatId }: fetchBotResponseParams,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const {
        newUserMessage,
        botMessage,
        updateStream,
      }: SendMessageReturnType = await sendMessage(
        currentModel,
        file,
        msg,
        currentChatId
      );

      console.log("New User Message: ");
      console.log(newUserMessage);
      console.log("Bot Message: ");
      console.log(botMessage);
      console.log("Update Stream");
      console.log(updateLog);

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
      console.log("ACTION PAYLOAD");
      console.log(action.payload);
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
