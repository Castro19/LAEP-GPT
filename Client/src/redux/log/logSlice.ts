import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import createLogTitle, {
  createLogItem,
  fetchAllLogs,
  updateLogItem,
  deleteLogItem,
} from "./crudLog";
import {
  LogData,
  LogSliceType,
  LogErrorCodes,
  logErrorMessages,
  MessageObjType,
} from "@/types";
import { RootState } from "../store";

export type AddLogParams = {
  msg: string;
  modelType: string;
  id: string;
  firebaseUserId: string | null;
};
// Thunk for adding a new log. Combines CREATE and READ operations.
export const addLog = createAsyncThunk(
  "log/addLog",
  async (
    { msg, modelType, id, firebaseUserId }: AddLogParams,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const logTitle = await createLogTitle(msg, modelType);
      const timestamp = new Date().toISOString(); // Timestamp for log
      const content = (getState() as RootState).message.msgList; // Accessing message list from the state

      if (logTitle) {
        dispatch(
          addLogList({
            id: id,
            title: logTitle,
            content: content, // Include the actual content
            timestamp: timestamp, // Include the timestamp
          })
        );
      }
      console.log("FBUID: ", firebaseUserId);
      if (firebaseUserId) {
        // Save Log to Database
        const savedLog = await createLogItem({
          id,
          firebaseUserId,
          title: logTitle,
          content: content, // Ensure the content is included in the DB save
          timestamp: timestamp, // Ensure the timestamp is included in the DB save
        });
        return savedLog;
      }
    } catch (error) {
      console.error("Failed to create log title: ", error);
      return rejectWithValue(logErrorMessages[LogErrorCodes.CREATE_FAILED]);
    }
  }
);

// Read (Fetch Logs by UserID)
export const fetchLogs = createAsyncThunk(
  "log/fetchLogs",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await fetchAllLogs(userId);
    } catch (error) {
      console.error("Failed to fetch logs: ", error);
      return rejectWithValue(logErrorMessages[LogErrorCodes.READ_FAILED]);
    }
  }
);
export type UpdateLogData = {
  logId: string;
  firebaseUserId: string | null;
  urlPhoto?: string;
  content?: MessageObjType[];
  timestamp?: string;
};

// Thunk for updating a log. Combines UPDATE and READ operations.
export const updateLog = createAsyncThunk(
  "log/updateLog",
  async (
    { logId, firebaseUserId }: UpdateLogData,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      console.log("FBUID: ", firebaseUserId);

      const timestamp = new Date().toISOString(); // Timestamp for updating log
      const content = (getState() as RootState).message.msgList; // Accessing current message list from the state
      console.log("logId: ", logId);
      dispatch(
        updateCurrentChat({
          id: logId,
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
      return rejectWithValue(logErrorMessages[LogErrorCodes.UPDATE_FAILED]);
    }
  }
);

export const deleteLog = createAsyncThunk(
  "log/deleteLog",
  async (
    { logId, userId }: { logId: string; userId: string | null },
    { dispatch, rejectWithValue }
  ) => {
    try {
      if (logId && userId) {
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
      return rejectWithValue(logErrorMessages[LogErrorCodes.DELETE_FAILED]);
    }
  }
);

const initialState: LogSliceType = {
  logList: [],
};

const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    // logList:
    // Reducer to add a new log to the state (CREATE)
    addLogList: (state, action: PayloadAction<LogData>) => {
      const { id, title, content, timestamp } = action.payload;
      const newLog = {
        id: id,
        content: [...content], // Use the content passed in the action
        title: title,
        timestamp: timestamp, // Use the timestamp passed in the action
      };

      state.logList.push(newLog);
    },
    // Reducer to update an existing log in the state (UPDATE)
    updateCurrentChat: (state, action: PayloadAction<LogData>) => {
      const { id, content, timestamp } = action.payload;
      const logIndex = state.logList.findIndex((log) => log.id === id);
      console.log("currentChatId: ", id);

      console.log("LOGINDEX: ", logIndex);
      if (logIndex !== -1) {
        state.logList[logIndex].content = [...content]; // Use content from the payload
        state.logList[logIndex].timestamp = timestamp; // Update the timestamp
      }
    },
    deleteLogListItem: (state, action: PayloadAction<{ logId: string }>) => {
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
      .addCase(fetchLogs.rejected, (_state, action) => {
        // Optionally handle error state
        console.error("Failed to load logs:", action.payload);
      });
  },
});

export const { addLogList, updateCurrentChat, deleteLogListItem } =
  logSlice.actions;

export const logReducer = logSlice.reducer;
