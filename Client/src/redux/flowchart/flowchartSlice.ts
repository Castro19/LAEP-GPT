import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Octokit } from "@octokit/rest";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flowchartData: any | null;
  loading: boolean;
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
  loading: false,
  error: null,
};

// Async thunks
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
    resetFlowchartData: (state) => {
      state.flowchartData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMajorOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMajorOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.majorOptions = action.payload;
      })
      .addCase(fetchMajorOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchConcentrationOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConcentrationOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.concentrationOptions = action.payload;
      })
      .addCase(fetchConcentrationOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFlowchartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlowchartData.fulfilled, (state, action) => {
        state.loading = false;
        state.flowchartData = action.payload;
      })
      .addCase(fetchFlowchartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelection, resetFlowchartData } = flowchartSlice.actions;
export const flowchartReducer = flowchartSlice.reducer;
