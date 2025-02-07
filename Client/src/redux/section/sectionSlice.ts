import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Section, SectionsFilterParams } from "@polylink/shared/types";
import { fetchSections } from "./crudSection";
import { environment } from "@/helpers/getEnvironmentVars";
interface SectionState {
  sections: Section[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: SectionsFilterParams;
}

const initialState: SectionState = {
  sections: [],
  total: 0,
  page: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    courseIds: [],
    status: "",
    subject: "",
    days: "",
    timeRange: "",
    minInstructorRating: "0",
    maxInstructorRating: "4",
    includeUnratedInstructors: true,
    units: "",
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
      return response; // { data, total, page, pageSize, totalPages }
    } catch (error) {
      if (environment === "dev") {
        console.error("Error fetching sections:", error);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectionsAsync.pending, (state) => {
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
      });
  },
});

export const { setFilters, setPage } = sectionSlice.actions;
export const sectionReducer = sectionSlice.reducer;
