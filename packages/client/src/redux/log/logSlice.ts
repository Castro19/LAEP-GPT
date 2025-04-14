import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllLogs,
  deleteLogItem,
  updateLogTitleInDB,
  upsertLogItem,
} from "./crudLog";
import { LogData, LogSliceType } from "@polylink/shared/types";
import { RootState } from "../store";
import { environment } from "@/helpers/getEnvironmentVars";

// Read (Fetch Logs by UserID)
export const fetchLogs = createAsyncThunk(
  "log/fetchLogs",
  async (_, { rejectWithValue }) => {
    try {
      const fetchedLogs = await fetchAllLogs();

      return fetchedLogs;
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to fetch logs: ", error);
      }
      return rejectWithValue({ message: "Failed to fetch logs" });
    }
  }
);

export type UpsertLogParams = {
  logId: string;
  assistantMongoId?: string;
  msg?: string;
};

export const upsertLog = createAsyncThunk(
  "log/upsertLog",
  async (
    { logId, assistantMongoId, msg }: UpsertLogParams,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const chatLog = (getState() as RootState).message.messagesByChatId[logId];

      if (!chatLog) {
        throw new Error("Chat log not found");
      }

      const { isNewChat, title, timestamp } = await upsertLogItem({
        logId,
        content: chatLog.content, // Ensure the content is included in the DB save
        // The following are only needed if creating a new log
        assistantMongoId,
        msg, // To make the title
      });

      if (isNewChat) {
        dispatch(
          addLogList({
            content: chatLog.content, // Include the actual content
            logId,
            title,
            timestamp, // Include the timestamp
          })
        );
      }

      return { success: true, logId, timestamp };
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to upsert log: ", error);
      }
      return rejectWithValue({ message: "Failed to upsert log" });
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
      if (environment === "dev") {
        console.error("Failed to update log title: ", error);
      }
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
      if (environment === "dev") {
        console.error("Failed to delete log: ", error);
      }
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
        if (environment === "dev") {
          console.error("Failed to load logs:", action.payload);
        }
      })
      .addCase(upsertLog.fulfilled, (state, action) => {
        const { logId, timestamp } = action.payload;
        const logIndex = state.logList.findIndex((log) => log.logId === logId);
        // Move the log to the front of the list
        if (logIndex !== -1) {
          state.logList[logIndex].timestamp = timestamp;

          const [removedLog] = state.logList.splice(logIndex, 1);
          state.logList.unshift(removedLog);
        }
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

export const { addLogList, deleteLogListItem } = logSlice.actions;

export const logReducer = logSlice.reducer;
