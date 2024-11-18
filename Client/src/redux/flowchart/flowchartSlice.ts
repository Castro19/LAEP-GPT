import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ConcentrationInfo,
  CourseSearch,
  FetchAllFlowchartsResponse,
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
  catalogOptions: string[];
  majorOptions: string[];
  concentrationOptions: ConcentrationInfo[];
  selections: {
    startingYear: string | null;
    catalog: string | null;
    major: string | null;
    concentration: ConcentrationInfo | null;
  };
  flowchartData: FlowchartData | null;
  courseCatalog: CourseSearch[] | null;
  flowchartList: FetchAllFlowchartsResponse[] | null;
  loading: {
    fetchMajorOptions: boolean;
    fetchConcentrationOptions: boolean;
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
  catalogOptions: ["2019-2020", "2020-2021", "2021-2022", "2022-2026"],
  majorOptions: [],
  concentrationOptions: [],
  courseCatalog: null,
  selections: {
    startingYear: null,
    catalog: null,
    major: null,
    concentration: null,
  },
  flowchartData: null,
  flowchartList: null,
  loading: {
    fetchMajorOptions: false,
    fetchConcentrationOptions: false,
    fetchFlowchartData: false,
    setFlowchart: false,
    fetchAllFlowcharts: false,
    updateFlowchart: false,
    deleteFlowchart: false,
  },
  error: null,
};

/**
 * Fetches the list of major options based on the selected catalog.
 * @param catalog The catalog year (e.g., "2022-2026").
 * @returns A list of major options.
 */
export const fetchMajorOptions = createAsyncThunk(
  "flowchart/fetchMajorOptions",
  async (catalog: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:4000/flowInfo?catalog=${catalog}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data as string[];
      }
      return [];
    } catch (error) {
      return rejectWithValue("Failed to fetch major options.");
    }
  }
);

/**
 * Fetches the list of concentration options based on the selected major.
 * @param catalog The catalog year (e.g., "2022-2026").
 * @param major The selected major (e.g., "Computer Science").
 * @returns A list of concentration options (file names without extensions).
 */
export const fetchConcentrationOptions = createAsyncThunk(
  "flowchart/fetchConcentrationOptions",
  async (
    { catalog, major }: { catalog: string; major: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `http://localhost:4000/flowInfo?catalog=${catalog}&majorName=${major}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data as ConcentrationInfo[];
      }
      return [];
    } catch (error) {
      return rejectWithValue("Failed to fetch concentration options.");
    }
  }
);

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
      const response = await fetchFlowchartFromDB(flowchartId);
      return response;
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
    setSelection: (
      state,
      action: PayloadAction<{
        key: keyof FlowchartState["selections"];
        value: string | ConcentrationInfo;
      }>
    ) => {
      if (action.payload.key === "concentration") {
        state.selections.concentration = action.payload
          .value as unknown as ConcentrationInfo;
      } else {
        state.selections[action.payload.key] = action.payload.value as string;
      }
    },
    setFlowchartData: (state, action: PayloadAction<FlowchartData>) => {
      state.flowchartData = action.payload;
    },
    resetFlowchartData: (state) => {
      state.flowchartData = null;
    },
    setFlowchartList: (
      state,
      action: PayloadAction<FetchAllFlowchartsResponse[]>
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
      // fetchMajorOptions
      .addCase(fetchMajorOptions.pending, (state) => {
        state.loading.fetchMajorOptions = true;
      })
      .addCase(fetchMajorOptions.fulfilled, (state, action) => {
        state.loading.fetchMajorOptions = false;
        state.majorOptions = action.payload;
      })
      .addCase(fetchMajorOptions.rejected, (state, action) => {
        state.loading.fetchMajorOptions = false;
        state.error = action.payload as string;
      })
      // fetchConcentrationOptions
      .addCase(fetchConcentrationOptions.pending, (state) => {
        state.loading.fetchConcentrationOptions = true;
      })
      .addCase(fetchConcentrationOptions.fulfilled, (state, action) => {
        state.loading.fetchConcentrationOptions = false;
        state.concentrationOptions = action.payload;
      })
      .addCase(fetchConcentrationOptions.rejected, (state, action) => {
        state.loading.fetchConcentrationOptions = false;
        state.error = action.payload as string;
      })
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
        state.flowchartData = action.payload;
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
        state.flowchartList =
          action.payload as unknown as FetchAllFlowchartsResponse[];
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
          ) as FetchAllFlowchartsResponse[];
        }
      })
      .addCase(deleteFlowchart.rejected, (state, action) => {
        state.loading.deleteFlowchart = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelection,
  setFlowchartData,
  resetFlowchartData,
  toggleCourseCompletion,
  setFlowchartList,
} = flowchartSlice.actions;

export const flowchartReducer = flowchartSlice.reducer;
