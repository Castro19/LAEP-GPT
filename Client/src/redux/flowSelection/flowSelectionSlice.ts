import { serverUrl } from "@/helpers/getEnvironmentVars";
import { ConcentrationInfo } from "@polylink/shared/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FlowSelectionState {
  catalogOptions: string[];
  majorOptions: string[];
  concentrationOptions: ConcentrationInfo[];
  courseCatalog: null;
  selections: {
    startingYear: string | null;
    catalog: string | null;
    major: string | null;
    concentration: ConcentrationInfo | null;
  };
  loading: {
    fetchMajorOptions: boolean;
    fetchConcentrationOptions: boolean;
  };
  error: string | null;
}

/**
 * Fetches the list of major options based on the selected catalog.
 * @param catalog The catalog year (e.g., "2022-2026").
 * @returns A list of major options.
 */
export const fetchMajorOptions = createAsyncThunk(
  "flowchart/fetchMajorOptions",
  async (catalog: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${serverUrl}/flowInfo?catalog=${catalog}`, {
        credentials: "include",
      });
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
        `${serverUrl}/flowInfo?catalog=${catalog}&majorName=${major}`,
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

// Initial state
const initialState: FlowSelectionState = {
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
  loading: {
    fetchMajorOptions: false,
    fetchConcentrationOptions: false,
  },
  error: null,
};

// Redux slice
const flowSelectionSlice = createSlice({
  name: "flowSelection",
  initialState,
  reducers: {
    setSelection: (
      state,
      action: PayloadAction<{
        key: keyof FlowSelectionState["selections"];
        value: string | ConcentrationInfo;
      }>
    ) => {
      if (action.payload.key === "concentration") {
        state.selections.concentration = action.payload
          .value as ConcentrationInfo;
      } else {
        state.selections[action.payload.key] = action.payload.value as string;
      }
    },
    resetConcentrationOptions: (state) => {
      state.concentrationOptions = [];
      state.selections.concentration = null;
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
      });
  },
});

export const { setSelection, resetConcentrationOptions } =
  flowSelectionSlice.actions;

export const flowSelectionReducer = flowSelectionSlice.reducer;
