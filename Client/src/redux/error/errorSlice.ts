import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createErrorReport } from "./crudError";
import { ErrorDocument } from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";

export type CreateErrorReportData = Omit<
  ErrorDocument,
  "_id" | "createdAt" | "updatedAt" | "status"
>;

interface ErrorSliceState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

interface ErrorPayload {
  message: string;
}

// Async thunk for creating an error report
export const submitErrorReport = createAsyncThunk<
  { message: string; errorId: string },
  CreateErrorReportData,
  { rejectValue: ErrorPayload }
>("error/submitErrorReport", async (errorData, { rejectWithValue }) => {
  try {
    const result = await createErrorReport(errorData);
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to submit error report: ", error);
    }
    return rejectWithValue({ message: "Failed to submit error report" });
  }
});

const initialState: ErrorSliceState = {
  isSubmitting: false,
  error: null,
  success: false,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    resetErrorState: (state) => {
      state.isSubmitting = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitErrorReport.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitErrorReport.fulfilled, (state) => {
        state.isSubmitting = false;
        state.error = null;
        state.success = true;
      })
      .addCase(submitErrorReport.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error =
          action.payload?.message || "Failed to submit error report";
        state.success = false;
      });
  },
});

export const { resetErrorState } = errorSlice.actions;

export const errorReducer = errorSlice.reducer;
