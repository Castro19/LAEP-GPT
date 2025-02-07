import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Section, SectionsFilterParams } from "@polylink/shared/types";
import { fetchSections, queryAI } from "./crudSection";
import { environment } from "@/helpers/getEnvironmentVars";
interface SectionState {
  sections: Section[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  queryError: string | null;
  queryExplanation: string | null;
  filters: SectionsFilterParams;
  isInitialState: boolean;
}

const initialState: SectionState = {
  sections: [],
  total: 0,
  page: 1,
  totalPages: 0,
  loading: false,
  error: null,
  queryError: null,
  queryExplanation: null,
  isInitialState: true,
  filters: {
    courseIds: [],
    status: "",
    subject: "",
    days: "",
    timeRange: "",
    minInstructorRating: "0",
    maxInstructorRating: "4",
    includeUnratedInstructors: true,
    minUnits: "0",
    maxUnits: "9",
    courseAttribute: [],
    instructionMode: "",
  },
};

// When calling fetchSections, pass page and pageSize too.
export const fetchSectionsAsync = createAsyncThunk(
  "sections/fetchSections",
  async (_, { getState }) => {
    try {
      // Destructure from Redux store
      const state = getState() as { section: SectionState };
      const { filters, page } = state.section;
      const response = await fetchSections(filters, page);
      return response; //
    } catch (error) {
      if (environment === "dev") {
        console.error("Error fetching sections:", error);
      }
      throw error;
    }
  }
);

export const queryAIAsync = createAsyncThunk(
  "sections/queryAI",
  async (query: string) => {
    try {
      const response = await queryAI(query);
      return response;
    } catch (error) {
      if (environment === "dev") {
        console.error("Error querying AI:", error);
      }
      throw error;
    }
  }
);
const sectionSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    // Example: let user set the entire filters object
    setFilters: (state, action: PayloadAction<SectionsFilterParams>) => {
      state.filters = action.payload;
    },
    // Let user directly change the page
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setIsInitialState: (state, action: PayloadAction<boolean>) => {
      state.isInitialState = action.payload;
    },
    setSections: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectionsAsync.pending, (state) => {
        state.queryError = null;
        state.queryExplanation = null;
        state.loading = true;
      })
      .addCase(fetchSectionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload.data;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchSectionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An unknown error occurred";
      })
      .addCase(queryAIAsync.pending, (state) => {
        state.loading = true;
        state.queryError = null;
        state.queryExplanation = null;
      })
      .addCase(queryAIAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload.results;
        state.total = action.payload.total;
        state.queryError = null;
        state.queryExplanation = action.payload.explanation;
      })
      .addCase(queryAIAsync.rejected, (state) => {
        state.loading = false;
        state.sections = [];
        state.total = 0;
        state.queryError = "Failed to generate query";
        state.queryExplanation = null;
      });
  },
});

export const { setFilters, setPage, setIsInitialState, setSections } =
  sectionSlice.actions;
export const sectionReducer = sectionSlice.reducer;
