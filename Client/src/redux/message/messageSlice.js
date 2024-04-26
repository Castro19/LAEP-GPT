import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sendMessage from "../../utils/handleMessage";
import createLogTitle from "../../utils/createLog";

export const fetchBotResponse = createAsyncThunk(
  "message/fetchBotResponse",
  async ({ modelType, msg }, { dispatch, rejectWithValue }) => {
    try {
      const { newUserMessage, botMessage, updateStream } = await sendMessage(
        modelType,
        msg
      );
      dispatch(addUserMessage(newUserMessage));
      dispatch(addUserMessage(botMessage));

      // Streaming updates
      await updateStream((botMessageId, text) => {
        dispatch(updateBotMessage({ id: botMessageId, text }));
      });

      return botMessage; // This represents the final state of the bot message
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const addLog = createAsyncThunk(
  "message/addLog",
  async ({ msg, modelType, currentChatId }, { dispatch, rejectWithValue }) => {
    try {
      const logTitle = await createLogTitle(msg, modelType);

      if (logTitle) {
        dispatch(
          addLogList({
            currentChatId: currentChatId,
            title: logTitle,
          })
        );
      }
    } catch (error) {
      console.error("Failed to create log title: ", error);
      return rejectWithValue(error.toString());
    }
  }
);
const initialState = {
  msgList: [],
  isLoading: false,
  error: null,
  logList: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.msgList.push(action.payload);
    },
    updateBotMessage: (state, action) => {
      const message = state.msgList.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.text = action.payload.text;
      }
    },
    setMsgList: (state, action) => {
      state.msgList = action.payload;
    },
    resetMsgList: (state) => {
      state.msgList = [];
    },
    // logList
    archiveCurrentChat: (state, action) => {
      const currentChatId = action.payload;
      const logIndex = state.logList.findIndex(
        (log) => log.id === currentChatId
      );
      if (logIndex !== -1) {
        state.logList[logIndex].content = [...state.msgList];
        state.logList[logIndex].timestamp = new Date().toISOString();
      }
    },
    addLogList: (state, action) => {
      const { currentChatId, title } = action.payload;

      const newLog = {
        id: currentChatId,
        content: [...state.msgList],
        title: title,
        timestamp: new Date().toISOString(),
      };

      state.logList.push(newLog);
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

export const {
  setMsgList,
  resetMsgList,
  addUserMessage,
  updateBotMessage,
  // logList
  archiveCurrentChat,
  addLogList,
} = messageSlice.actions;
export default messageSlice.reducer;
