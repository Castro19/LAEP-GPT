import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sendMessage from "../../utils/handleMessage";
import createLogTitle, {
  createLogItem,
  updateLogItem,
} from "../../utils/createLog";

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

// LogList: Create the initial Log:
export const addLog = createAsyncThunk(
  "message/addLog",
  async (
    { msg, modelType, currentChatId, firebaseUserId },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const logTitle = await createLogTitle(msg, modelType);
      const timestamp = new Date().toISOString(); // Create timestamp to use in both Redux and DB update
      const content = getState().message.msgList; // Get the current message list from state

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

// LogList: Update the LogList
export const updateLog = createAsyncThunk(
  "message/updateLog",
  async (
    { logId, firebaseUserId },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const timestamp = new Date().toISOString(); // Create timestamp to use in both Redux and DB update
      const content = getState().message.msgList; // Get the current message list from state
      console.log("logId: ", logId);
      dispatch(
        updateCurrentChat({
          currentChatId: logId,
        })
      );

      if (firebaseUserId) {
        // Update Log to Database
        const updatedLog = await updateLogItem({
          logId,
          firebaseUserId,
          content, // Ensure the content is included in the DB save
          timestamp, // Ensure the timestamp is included in the DB save
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
    // msgList
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
    // logList:
    // Create or Update or both?
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
    // updateLogList: (state, action) => {
    //   const { currentChatId, content, timestamp } = action.payload;

    // }
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
