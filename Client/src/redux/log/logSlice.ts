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
};
// Thunk for adding a new log. Combines CREATE and READ operations.
export const addLog = createAsyncThunk(
  "log/addLog",
  async (
    { msg, modelType, id }: AddLogParams,
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
      // Save Log to Database
      const savedLog = await createLogItem({
        id,
        title: logTitle,
        content: content, // Ensure the content is included in the DB save
        timestamp: timestamp, // Ensure the timestamp is included in the DB save
      });
      return savedLog;
    } catch (error) {
      console.error("Failed to create log title: ", error);
      return rejectWithValue(logErrorMessages[LogErrorCodes.CREATE_FAILED]);
    }
  }
);

// Read (Fetch Logs by UserID)
export const fetchLogs = createAsyncThunk(
  "log/fetchLogs",
  async (_, { rejectWithValue }) => {
    try {
      const fetchedLogs = await fetchAllLogs();
      // reverse the order of the logs
      const logs = fetchedLogs.reverse();
      return logs;
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
      const timestamp = new Date().toISOString(); // Timestamp for updating log
      const content = (getState() as RootState).message.msgList; // Accessing current message list from the state
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
  async ({ logId }: { logId: string }, { dispatch, rejectWithValue }) => {
    try {
      const deletedLog = await deleteLogItem({
        logId,
      });
      dispatch(deleteLogListItem({ logId }));
      return deletedLog;
    } catch (error) {
      console.error("Failed to delete log: ", error);
      return rejectWithValue(logErrorMessages[LogErrorCodes.DELETE_FAILED]);
    }
  }
);

const initialState: LogSliceType = {
  logList: [],
  deletingLogIds: [], // Add this array
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

      if (logIndex !== -1) {
        state.logList[logIndex].content = [...content]; // Use content from the payload
        state.logList[logIndex].timestamp = timestamp; // Update the timestamp
      }
    },
    deleteLogListItem: (state, action: PayloadAction<{ logId: string }>) => {
      const { logId } = action.payload;
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
      })
      .addCase(deleteLog.pending, (state, action) => {
        state.deletingLogIds.push(action.meta.arg.logId);
      })
      .addCase(deleteLog.fulfilled, (state, action) => {
        const index = state.deletingLogIds.indexOf(action.meta.arg.logId);
        if (index > -1) {
          state.deletingLogIds.splice(index, 1);
        }
      });
  },
});

export const { addLogList, updateCurrentChat, deleteLogListItem } =
  logSlice.actions;

export const logReducer = logSlice.reducer;
