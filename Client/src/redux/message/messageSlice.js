import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sendMessage from "../../utils/handleMessage";
import createLogTitle, {
  createLogItem,
  updateLogItem,
} from "../../utils/createLog";

// Thunk for fetching the bot response. Performs READ operation by getting messages from the backend.
export const fetchBotResponse = createAsyncThunk(
  "message/fetchBotResponse",
  async ({ modelType, msg }, { dispatch, rejectWithValue }) => {
    try {
      const { newUserMessage, botMessage, updateStream } = await sendMessage(
        modelType,
        msg
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

// Thunk for adding a new log. Combines CREATE and READ operations.
export const addLog = createAsyncThunk(
  "message/addLog",
  async (
    { msg, modelType, currentChatId, firebaseUserId },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const logTitle = await createLogTitle(msg, modelType);
      const timestamp = new Date().toISOString(); // Timestamp for log
      const content = getState().message.msgList; // Accessing message list from the state

      if (logTitle) {
        dispatch(
          addLogList({
            currentChatId: currentChatId,
            title: logTitle,
            content: content, // Include the actual content
            timestamp: timestamp, // Include the timestamp
          })
        );
      }
      if (firebaseUserId) {
        // Save Log to Database
        const savedLog = await createLogItem({
          currentChatId,
          firebaseUserId,
          title: logTitle,
          content: content, // Ensure the content is included in the DB save
          timestamp: timestamp, // Ensure the timestamp is included in the DB save
        });
        return savedLog;
      }
    } catch (error) {
      console.error("Failed to create log title: ", error);
      return rejectWithValue(error.toString());
    }
  }
);

// Thunk for updating a log. Combines UPDATE and READ operations.
export const updateLog = createAsyncThunk(
  "message/updateLog",
  async (
    { logId, firebaseUserId },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const timestamp = new Date().toISOString(); // Timestamp for updating log
      const content = getState().message.msgList; // Accessing current message list from the state
      console.log("logId: ", logId);
      dispatch(
        updateCurrentChat({
          currentChatId: logId,
        })
      );

      if (firebaseUserId) {
        // Update log in the database
        const updatedLog = await updateLogItem({
          logId,
          firebaseUserId,
          content,
          timestamp,
        });
        return updatedLog;
      }
    } catch (error) {
      console.error("Failed to update log: ", error);
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
    // logList:
    // Reducer to add a new log to the state (CREATE)
    addLogList: (state, action) => {
      const { currentChatId, title, content, timestamp } = action.payload;

      const newLog = {
        id: currentChatId,
        content: [...content], // Use the content passed in the action
        title: title,
        timestamp: timestamp, // Use the timestamp passed in the action
      };

      state.logList.push(newLog);
    },
    // Reducer to update an existing log in the state (UPDATE)
    updateCurrentChat: (state, action) => {
      const { currentChatId } = action.payload;
      const logIndex = state.logList.findIndex(
        (log) => log.id === currentChatId
      );
      console.log("currentChatId: ", currentChatId);

      console.log("LOGINDEX: ", logIndex);
      if (logIndex !== -1) {
        state.logList[logIndex].content = [...state.msgList];
        state.logList[logIndex].timestamp = new Date().toISOString();
      }
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
  addLogList,
  updateCurrentChat,
} = messageSlice.actions;
export default messageSlice.reducer;
