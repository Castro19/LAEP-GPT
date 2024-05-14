import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sendMessage from "../../utils/handleMessage";

// Thunk for fetching the bot response. Performs READ operation by getting messages from the backend.
export const fetchBotResponse = createAsyncThunk(
  "message/fetchBotResponse",
  async ({ modelType, msg, currentChatId }, { dispatch, rejectWithValue }) => {
    try {
      const { newUserMessage, botMessage, updateStream } = await sendMessage(
        modelType,
        msg,
        currentChatId
      );
      dispatch(addUserMessage(newUserMessage)); // Dispatching to add user message to the state

      dispatch(addUserMessage(botMessage)); // Dispatching to add bot message to the state

      // Streaming updates for the bot messages
      await updateStream((botMessageId, text) => {
        dispatch(updateBotMessage({ id: botMessageId, text })); // Updating existing bot message
      });

      return botMessage; // Returning the final state of the bot message
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);
const initialState = {
  msgList: [],
  isLoading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Reducer to add user or bot message to the state (CREATE)
    addUserMessage: (state, action) => {
      state.msgList.push(action.payload);
    },
    // Reducer to update an existing bot message in the state (UPDATE)
    updateBotMessage: (state, action) => {
      const message = state.msgList.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.text = action.payload.text;
      }
    },
    // Reducer to set the entire message list (typically for initial load e.g. when a user selects a new log or new chat) (UPDATE)
    setMsgList: (state, action) => {
      state.msgList = action.payload;
    },
    // Reducer to clear the message list (DELETE)
    resetMsgList: (state) => {
      state.msgList = [];
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
        state.error = action.payload;
      });
  },
});

export const { setMsgList, resetMsgList, addUserMessage, updateBotMessage } =
  messageSlice.actions;
export default messageSlice.reducer;
