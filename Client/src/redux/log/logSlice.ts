import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchLogsByPage,
  deleteLogItem,
  updateLogTitleInDB,
  upsertLogItem,
} from "./crudLog";
import { LogData, LogSliceType } from "@polylink/shared/types";
import { RootState } from "../store";
import { environment } from "@/helpers/getEnvironmentVars";

const LOGS_PER_PAGE = 2;

interface PaginatedLogSliceState extends LogSliceType {
  isLoading: boolean;
  currentPage: number;
  hasMoreLogs: boolean;
}

// Thunk to load a specific page of logs (limit is hardcoded to 20)
export const fetchLogs = createAsyncThunk(
  "log/fetchLogs",
  async (page: number, { getState, rejectWithValue }) => {
    const { isLoading } = (getState() as RootState).log;
    if (isLoading && page > 1) {
      return rejectWithValue("Already loading logs.");
    }
    try {
      const fetchedLogs = await fetchLogsByPage(page, LOGS_PER_PAGE);
      return { logs: fetchedLogs, page };
    } catch (error) {
      if (environment === "dev") {
        console.error(`Failed to fetch logs for page ${page}: `, error);
      }
      return rejectWithValue({
        message: `Failed to fetch logs for page ${page}`,
      });
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
        content: chatLog.content,
        assistantMongoId,
        msg,
      });

      if (isNewChat) {
        dispatch(
          addLogList({
            content: chatLog.content,
            logId,
            title,
            timestamp,
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

const initialState: PaginatedLogSliceState = {
  logList: [],
  deletingLogIds: [],
  isLoading: false,
  currentPage: 0,
  hasMoreLogs: true,
};

const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    addLogList: (state, action: PayloadAction<LogData>) => {
      const { logId, title, content, timestamp } = action.payload;
      const newLog = {
        logId,
        content: [...content],
        title: title,
        timestamp: timestamp,
      };

      state.logList.unshift(newLog); // Push to the front of the array
    },
    deleteLogListItem: (state, action: PayloadAction<{ logId: string }>) => {
      const { logId } = action.payload;
      state.logList = state.logList.filter((log) => log.logId != logId);
    },
    resetLogPagination: (state) => {
      state.logList = [];
      state.currentPage = 0;
      state.hasMoreLogs = true;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        const { logs, page } = action.payload;
        console.log(`Fetched page ${page}, logs received:`, logs.length); // Add log

        // If it's the first page, replace the list. Otherwise, append.
        if (page === 1) {
          state.logList = logs;
        } else {
          // Add only new logs to avoid duplicates if re-fetching the same page
          const existingLogIds = new Set(state.logList.map((log) => log.logId));
          const newLogs = logs.filter((log) => !existingLogIds.has(log.logId));
          state.logList.push(...newLogs);
        }

        state.currentPage = page;
        state.hasMoreLogs = logs.length === LOGS_PER_PAGE;
        console.log(
          `After page ${page} fetch: hasMoreLogs=${state.hasMoreLogs}, currentPage=${state.currentPage}`
        ); // Add log
        state.isLoading = false;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.isLoading = false;
        // If the fetch for page 1 fails, we might want to clear the list
        if (action.meta.arg === 1) {
          state.logList = [];
          state.hasMoreLogs = false; // Can't load more if page 1 failed
        }
        if (environment === "dev") {
          console.error(
            "Failed to load logs:",
            action.payload || action.error.message
          );
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
      .addCase(deleteLog.rejected, (state, action) => {
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

export const { addLogList, deleteLogListItem, resetLogPagination } =
  logSlice.actions;

export const logReducer = logSlice.reducer;
