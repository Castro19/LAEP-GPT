import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Octokit } from "@octokit/rest";
import { FlowchartData, Term } from "@/types";
import { fetchFlowchartFromDB, storeFlowchartInDB } from "./crudFlowchart";

const octokit = new Octokit();
const owner = "polyflowbuilder";
const repo = "polyflowbuilder";
const basePath = "api/data/flows/json/dflows";

// Define types
interface FlowchartState {
  catalogOptions: string[];
  majorOptions: string[];
  concentrationOptions: string[];
  selections: Record<string, string>;
  flowchartData: FlowchartData | null;
  loading: {
    fetchMajorOptions: boolean;
    fetchConcentrationOptions: boolean;
    fetchFlowchartData: boolean;
    setFlowchart: boolean;
  };
  error: string | null;
}

// Initial state
const initialState: FlowchartState = {
  catalogOptions: [
    "2015-2017",
    "2017-2019",
    "2019-2020",
    "2020-2021",
    "2021-2022",
    "2022-2026",
  ],
  majorOptions: [],
  concentrationOptions: [],
  selections: {},
  flowchartData: null,
  loading: {
    fetchMajorOptions: false,
    fetchConcentrationOptions: false,
    fetchFlowchartData: false,
    setFlowchart: false,
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
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: `${basePath}/${catalog}`,
      });
      if (Array.isArray(response.data)) {
        return response.data
          .filter((item) => item.type === "dir")
          .map((item) => item.name);
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
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: `${basePath}/${catalog}/${major}`,
      });
      if (Array.isArray(response.data)) {
        return response.data
          .filter((item) => item.type === "file" && item.name.endsWith(".json"))
          .map((item) => item.name.replace(".json", ""));
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
  async (flowchartData: FlowchartData, { rejectWithValue }) => {
    try {
      const response = await storeFlowchartInDB(flowchartData);
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

// Redux slice
const flowchartSlice = createSlice({
  name: "flowchart",
  initialState,
  reducers: {
    setSelection: (
      state,
      action: PayloadAction<{ key: string; value: string }>
    ) => {
      state.selections[action.payload.key] = action.payload.value;
    },
    setFlowchartData: (state, action: PayloadAction<FlowchartData>) => {
      state.flowchartData = action.payload;
    },
    resetFlowchartData: (state) => {
      state.flowchartData = null;
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
      });
  },
});

export const {
  setSelection,
  setFlowchartData,
  resetFlowchartData,
  toggleCourseCompletion,
} = flowchartSlice.actions;

export const flowchartReducer = flowchartSlice.reducer;
