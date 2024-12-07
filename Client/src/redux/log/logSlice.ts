import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import createLogTitle, {
  createLogItem,
  fetchAllLogs,
  updateLogItem,
  deleteLogItem,
  updateLogTitleInDB,
} from "./crudLog";
import { LogData, LogSliceType, MessageObjType } from "@polylink/shared/types";
import { RootState } from "../store";

export type AddLogParams = {
  msg: string;
  modelTitle: string;
  id: string;
};
// Thunk for adding a new log. Combines CREATE and READ operations.
export const addLog = createAsyncThunk(
  "log/addLog",
  async (
    { msg, modelTitle, id }: AddLogParams,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const logTitle = await createLogTitle(msg, modelTitle);
      const timestamp = new Date().toISOString(); // Timestamp for log
      const content = (getState() as RootState).message.msgList; // Accessing message list from the state

      if (logTitle) {
        dispatch(
          addLogList({
            content: content, // Include the actual content
            logId: id,
            timestamp: timestamp, // Include the timestamp
            title: logTitle,
          })
        );
      }
      // Save Log to Database
      await createLogItem({
        content: content, // Ensure the content is included in the DB save
        logId: id,
        timestamp: timestamp, // Ensure the timestamp is included in the DB save
        title: logTitle,
      });
      return { success: true, logId: id };
    } catch (error) {
      console.error("Failed to create log title: ", error);
      return rejectWithValue({ message: "Failed to create log title" });
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
      return rejectWithValue({ message: "Failed to fetch logs" });
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

      // TO-DO: Handle updating the timestamp on server side and update the state on the return value
      dispatch(
        updateLogTimestamp({
          logId,
          timestamp,
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
      return rejectWithValue({ message: "Failed to update log" });
    }
  }
);

export type UpdateLogTitleData = {
  logId: string;
  title: string;
};
export const updateLogTitle = createAsyncThunk(
  "log/updateLogTitle",
  async ({ logId, title }: UpdateLogTitleData, { rejectWithValue }) => {
    try {
      const updatedLog = await updateLogTitleInDB({ logId, title });
      return updatedLog;
    } catch (error) {
      console.error("Failed to update log title: ", error);
      return rejectWithValue({ message: "Failed to update log title" });
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
      return rejectWithValue({ message: "Failed to delete log" });
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
      const { logId, title, content, timestamp } = action.payload;
      const newLog = {
        logId,
        content: [...content], // Use the content passed in the action
        title: title,
        timestamp: timestamp, // Use the timestamp passed in the action
      };

      state.logList.unshift(newLog); // Push to the front of the array
    },
    // Reducer to update an existing log in the state (UPDATE)
    updateLogTimestamp: (
      state,
      action: PayloadAction<{ logId: string; timestamp: string }>
    ) => {
      const { logId, timestamp } = action.payload;
      const logIndex = state.logList.findIndex((log) => log.logId === logId);

      if (logIndex !== -1) {
        state.logList[logIndex].timestamp = timestamp; // Update the timestamp
      }
    },
    deleteLogListItem: (state, action: PayloadAction<{ logId: string }>) => {
      const { logId } = action.payload;
      state.logList = state.logList.filter((log) => log.logId != logId);
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
      })
      .addCase(updateLogTitle.fulfilled, (state, action) => {
        const { message, logId, title } = action.payload;
        if (message === "Log title updated successfully") {
          const logIndex = state.logList.findIndex(
            (log) => log.logId === logId
          );
          if (logIndex !== -1) {
            state.logList[logIndex].title = title;
          }
        }
      });
  },
});

export const { addLogList, updateLogTimestamp, deleteLogListItem } =
  logSlice.actions;

export const logReducer = logSlice.reducer;
