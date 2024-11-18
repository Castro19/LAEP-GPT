import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchFlowchartResponse,
  FlowchartData,
  PostFlowchartInDB,
  Term,
} from "@/types";
import {
  deleteFlowchartFromDB,
  fetchAllFlowchartsFromDB,
  fetchFlowchartFromDB,
  storeFlowchartInDB,
  updateFlowchartInDB,
} from "./crudFlowchart";
// Define types
interface FlowchartState {
  flowchartData: FlowchartData | null;
  flowchartList: FetchFlowchartResponse[] | null;
  currentFlowchart: FetchFlowchartResponse | null;
  loading: {
    fetchFlowchartData: boolean;
    setFlowchart: boolean;
    fetchAllFlowcharts: boolean;
    updateFlowchart: boolean;
    deleteFlowchart: boolean;
  };
  error: string | null;
}

// Initial state
const initialState: FlowchartState = {
  flowchartData: null,
  flowchartList: null,
  currentFlowchart: null,
  loading: {
    fetchFlowchartData: false,
    setFlowchart: false,
    fetchAllFlowcharts: false,
    updateFlowchart: false,
    deleteFlowchart: false,
  },
  error: null,
};

// Async thunk for fetching flowchart data
export const fetchFlowchartData = createAsyncThunk(
  "flowchart/fetchFlowchartData",
  async (fileUrl: string, { rejectWithValue }) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch flowchart data.");
      }
      return await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Creates a flowchart based on the flowchart data.
 * @param flowchartData The flowchart data.
 * @returns flowchartId .
 */
export const postFlowchartInDB = createAsyncThunk(
  "flowchart/postFlowchartInDB",
  async (
    { flowchartData, name, primaryOption }: PostFlowchartInDB,
    { rejectWithValue }
  ) => {
    try {
      const response = await storeFlowchartInDB(
        flowchartData,
        name,
        primaryOption ?? true
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

/**
 * Fetches the flowchart from the database and sets it in the state.
 * @param flowchartId The flowchart ID.
 * @returns The flowchart data.
 */
export const setFlowchart = createAsyncThunk(
  "flowchart/fetchFlowchartFromDB",
  async (flowchartId: string, { rejectWithValue }) => {
    try {
      return await fetchFlowchartFromDB(flowchartId);
    } catch (error) {
      return rejectWithValue("Failed to fetch flowchart from DB.");
    }
  }
);

/**
 * Fetches all flowcharts from the database.
 * @returns The flowchart data { flowchartId, name }[]
 */
export const fetchAllFlowcharts = createAsyncThunk(
  "flowchart/fetchAllFlowcharts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllFlowchartsFromDB();
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch all flowcharts.");
    }
  }
);
/**
 * Updates the flowchart in the database.
 * @param flowchartId The flowchart ID.
 * @param flowchartData The flowchart data.
 * @param name The flowchart name.
 * @returns void
 */
export const updateFlowchart = createAsyncThunk(
  "flowchart/updateFlowchartInDB",
  async (
    {
      flowchartId,
      flowchartData,
      name,
      primaryOption,
    }: {
      flowchartId: string;
      flowchartData: FlowchartData | null;
      name: string;
      primaryOption: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateFlowchartInDB(
        flowchartId,
        flowchartData,
        name,
        primaryOption
      );
      console.log("Flowchart updated in DB: ", response);
    } catch (error) {
      return rejectWithValue("Failed to update flowchart in DB.");
    }
  }
);

/**
 * Deletes the flowchart from the database.
 * @param flowchartId The flowchart ID.
 * @returns void
 */
export const deleteFlowchart = createAsyncThunk(
  "flowchart/deleteFlowchart",
  async (flowchartId: string, { rejectWithValue }) => {
    try {
      await deleteFlowchartFromDB(flowchartId);
      return flowchartId;
    } catch (error) {
      return rejectWithValue("Failed to delete flowchart from DB.");
    }
  }
);

// Redux slice
const flowchartSlice = createSlice({
  name: "flowchart",
  initialState,
  reducers: {
    setFlowchartData: (state, action: PayloadAction<FlowchartData>) => {
      state.flowchartData = action.payload;
    },
    setCurrentFlowchart: (
      state,
      action: PayloadAction<FetchFlowchartResponse | null>
    ) => {
      state.currentFlowchart = action.payload;
    },
    resetFlowchartData: (state) => {
      state.flowchartData = null;
    },
    setFlowchartList: (
      state,
      action: PayloadAction<FetchFlowchartResponse[]>
    ) => {
      state.flowchartList = action.payload;
    },
    toggleCourseCompletion: (
      state,
      action: PayloadAction<{ termIndex: number; courseIndex: number }>
    ) => {
      const { termIndex, courseIndex } = action.payload;
      if (!state.flowchartData) return;

      const term = state.flowchartData.termData.find(
        (t: Term) => t.tIndex === termIndex
      );
      if (!term) return;

      const course = term.courses[courseIndex];
      if (course) {
        course.completed = !course.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // createFlowchart
      .addCase(postFlowchartInDB.pending, (state) => {
        state.loading.setFlowchart = true;
        state.error = null;
      })
      .addCase(postFlowchartInDB.fulfilled, (state, action) => {
        state.loading.setFlowchart = false;
        if (!state.flowchartList) {
          state.flowchartList = [action.payload];
        } else {
          state.flowchartList.push(action.payload);
        }
      })
      .addCase(postFlowchartInDB.rejected, (state, action) => {
        state.loading.setFlowchart = false;
        state.error = action.payload as string;
      })
      // fetchFlowchartData
      .addCase(fetchFlowchartData.pending, (state) => {
        state.loading.fetchFlowchartData = true;
        state.error = null;
      })
      .addCase(fetchFlowchartData.fulfilled, (state, action) => {
        state.loading.fetchFlowchartData = false;
        state.flowchartData = action.payload;
      })
      .addCase(fetchFlowchartData.rejected, (state, action) => {
        state.loading.fetchFlowchartData = false;
        state.error = action.payload as string;
      })
      // setFlowchart (fetch from MongoDB)
      .addCase(setFlowchart.pending, (state) => {
        state.loading.setFlowchart = true;
        state.error = null;
      })
      .addCase(setFlowchart.fulfilled, (state, action) => {
        state.flowchartData = action.payload.flowchartData;
        state.currentFlowchart = action.payload.flowchartMeta;
        state.loading.setFlowchart = false;
      })
      .addCase(setFlowchart.rejected, (state, action) => {
        state.loading.setFlowchart = false;
        state.error = action.payload as string;
      })
      // fetchAllFlowcharts
      .addCase(fetchAllFlowcharts.pending, (state) => {
        state.loading.fetchAllFlowcharts = true;
      })
      .addCase(fetchAllFlowcharts.fulfilled, (state, action) => {
        state.loading.fetchAllFlowcharts = false;
        state.flowchartList = action.payload as FetchFlowchartResponse[];
      })
      .addCase(fetchAllFlowcharts.rejected, (state, action) => {
        state.loading.fetchAllFlowcharts = false;
        state.error = action.payload as string;
      })
      // updateFlowchart
      .addCase(updateFlowchart.pending, (state) => {
        state.loading.updateFlowchart = true;
      })
      .addCase(updateFlowchart.fulfilled, (state, action) => {
        if (state.flowchartList) {
          state.flowchartList = state.flowchartList.map((flowchart) => ({
            ...flowchart,
            primaryOption:
              flowchart.flowchartId === action.meta.arg.flowchartId
                ? action.meta.arg.primaryOption
                : action.meta.arg.primaryOption
                  ? false
                  : flowchart.primaryOption,
          }));
        }
        state.loading.updateFlowchart = false;
      })
      .addCase(updateFlowchart.rejected, (state, action) => {
        state.loading.updateFlowchart = false;
        state.error = action.payload as string;
      })
      // deleteFlowchart
      .addCase(deleteFlowchart.pending, (state) => {
        state.loading.deleteFlowchart = true;
      })
      .addCase(deleteFlowchart.fulfilled, (state, action) => {
        state.loading.deleteFlowchart = false;
        if (state.flowchartList) {
          state.flowchartList = state.flowchartList?.filter(
            (flowchart) => flowchart.flowchartId !== action.payload
          ) as FetchFlowchartResponse[];
        }
      })
      .addCase(deleteFlowchart.rejected, (state, action) => {
        state.loading.deleteFlowchart = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFlowchartData,
  setCurrentFlowchart,
  resetFlowchartData,
  toggleCourseCompletion,
  setFlowchartList,
} = flowchartSlice.actions;

export const flowchartReducer = flowchartSlice.reducer;
