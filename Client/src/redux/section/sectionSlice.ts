import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Section, SectionsFilterParams } from "@polylink/shared/types";
import { fetchSections } from "./crudSection";

interface SectionState {
  sections: Section[];
  loading: boolean;
  error: string | null;
  filters: SectionsFilterParams;
}

const initialState: SectionState = {
  sections: [],
  loading: false,
  error: null,
  filters: {
    courseIds: [],
    status: "",
    subject: "",
    days: "",
    timeRange: "",
    instructorRating: "",
    units: "",
    courseAttribute: [],
    instructionMode: "",
  },
};

export const fetchSectionsAsync = createAsyncThunk(
  "sections/fetchSections",
  async (filter: SectionsFilterParams) => {
    try {
      const response = await fetchSections(filter);
      console.log("FETCHED SECTIONS", response);
      return response;
    } catch (error) {
      console.error("Error fetching sections:", error);
      throw error;
    }
  }
);

const sectionSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    // Replace the entire filters object.
    setFilters: (state, action: PayloadAction<SectionsFilterParams>) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectionsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSectionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
      })
      .addCase(fetchSectionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An unknown error occurred";
      });
  },
});

export const { setFilters } = sectionSlice.actions;
export const sectionReducer = sectionSlice.reducer;
