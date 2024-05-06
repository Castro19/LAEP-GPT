import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import createLogTitle, {
  createLogItem,
  updateLogItem,
  deleteLogItem,
} from "../../utils/createLog";

// Thunk for adding a new log. Combines CREATE and READ operations.
export const addLog = createAsyncThunk(
  "log/addLog",
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

// Read (Fetch Logs by UserID)
export const fetchLogs = createAsyncThunk(
  "log/fetchLogs",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/chatLogs/${userId}`);
      if (!response.ok) {
        console.error("Response Error  fetching chat Logs");
        return [];
      }
      const logs = await response.json();
      return logs;
    } catch (error) {
      console.error("Failed to fetch logs: ", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for updating a log. Combines UPDATE and READ operations.
export const updateLog = createAsyncThunk(
  "log/updateLog",
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
          content: content, // Pass the msgList as part of the payload
          timestamp: timestamp,
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

export const deleteLog = createAsyncThunk(
  "log/deleteLog",
  async ({ logId, userId }, { dispatch, rejectWithValue }) => {
    try {
      if (logId) {
        const deletedLog = await deleteLogItem({
          logId,
          userId,
        });
        console.log("DELETED LOG RESPONSE: ", deletedLog);
        dispatch(deleteLogListItem({ logId }));

        return deletedLog;
      }
    } catch (error) {
      console.log("Failed to delete log: ", error);
      return rejectWithValue(error.toString());
    }
  }
);

const initialState = {
  logList: [],
};

const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
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
      const { currentChatId, content, timestamp } = action.payload;
      const logIndex = state.logList.findIndex(
        (log) => log.id === currentChatId
      );
      console.log("currentChatId: ", currentChatId);

      console.log("LOGINDEX: ", logIndex);
      if (logIndex !== -1) {
        state.logList[logIndex].content = [...content]; // Use content from the payload
        state.logList[logIndex].timestamp = timestamp; // Update the timestamp
      }
    },
    deleteLogListItem: (state, action) => {
      const { logId } = action.payload;
      // console.log("LOG ID IN SLICE B4 DELETING; ", logId);
      state.logList = state.logList.filter((log) => log.id != logId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.logList = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        // Optionally handle error state
        console.error("Failed to load logs:", action.payload);
      });
  },
});

export const {
  // logList
  addLogList,
  updateCurrentChat,
  deleteLogListItem,
} = logSlice.actions;
export default logSlice.reducer;
