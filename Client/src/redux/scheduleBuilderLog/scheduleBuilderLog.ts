import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchedScheduleBuilderLog,
  FetchedScheduleBuilderLogListItem,
} from "@polylink/shared/types";
import {
  fetchAllLogsFromDB,
  fetchLogByThreadIdFromDB,
  deleteLogFromDB,
} from "./crudScheduleBuilderLog";
import { environment } from "@/helpers/getEnvironmentVars";

interface ErrorPayload {
  message: string;
}

interface ScheduleBuilderLogState {
  logs: FetchedScheduleBuilderLogListItem[];
  currentLog: FetchedScheduleBuilderLog | null;
  isLoading: boolean;
  error: string | null;
  deletingThreadIds: string[];
}

const initialState: ScheduleBuilderLogState = {
  logs: [],
  currentLog: null,
  isLoading: false,
  error: null,
  deletingThreadIds: [],
};

// Async thunks
export const fetchAllLogs = createAsyncThunk<
  FetchedScheduleBuilderLogListItem[],
  void,
  { rejectValue: ErrorPayload }
>("scheduleBuilderLog/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const logs = await fetchAllLogsFromDB();
    return logs;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to fetch logs:", error);
    }
    return rejectWithValue({
      message: "Failed to fetch logs",
    });
  }
});

export const fetchLogByThreadId = createAsyncThunk<
  FetchedScheduleBuilderLog,
  string,
  { rejectValue: ErrorPayload }
>(
  "scheduleBuilderLog/fetchByThreadId",
  async (threadId, { rejectWithValue }) => {
    try {
      const log = await fetchLogByThreadIdFromDB(threadId);
      return log;
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to fetch log:", error);
      }
      return rejectWithValue({
        message: "Failed to fetch log",
      });
    }
  }
);

export const deleteLog = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorPayload }
>(
  "scheduleBuilderLog/delete",
  async (threadId, { dispatch, rejectWithValue }) => {
    try {
      await deleteLogFromDB(threadId);
      // Refresh the logs list after deletion
      dispatch(fetchAllLogs());
      return threadId;
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to delete log:", error);
      }
      return rejectWithValue({
        message: "Failed to delete log",
      });
    }
  }
);

const scheduleBuilderLogSlice = createSlice({
  name: "scheduleBuilderLog",
  initialState,
  reducers: {
    setLogs: (
      state,
      action: PayloadAction<FetchedScheduleBuilderLogListItem[]>
    ) => {
      state.logs = action.payload;
      state.error = null;
    },
    setCurrentLog: (
      state,
      action: PayloadAction<FetchedScheduleBuilderLog | null>
    ) => {
      state.currentLog = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLog: (state) => {
      state.currentLog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all logs
      .addCase(fetchAllLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllLogs.fulfilled, (state, action) => {
        state.logs = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch logs";
      })
      // Fetch log by thread ID
      .addCase(fetchLogByThreadId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLogByThreadId.fulfilled, (state, action) => {
        state.currentLog = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLogByThreadId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch log";
      })
      // Delete log
      .addCase(deleteLog.pending, (state, action) => {
        state.deletingThreadIds.push(action.meta.arg);
      })
      .addCase(deleteLog.fulfilled, (state, action) => {
        state.deletingThreadIds = state.deletingThreadIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(deleteLog.rejected, (state, action) => {
        state.deletingThreadIds = state.deletingThreadIds.filter(
          (id) => id !== action.meta.arg
        );
        state.error = action.payload?.message || "Failed to delete log";
      });
  },
});

export const { setLogs, setCurrentLog, clearError, clearCurrentLog } =
  scheduleBuilderLogSlice.actions;

export const scheduleBuilderLogReducer = scheduleBuilderLogSlice.reducer;
