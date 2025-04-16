import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  SectionDetail,
  SelectedSection,
  CourseTerm,
} from "@polylink/shared/types";
import {
  fetchSections,
  createOrUpdateSection,
  transformSectionToSelectedSectionItem,
  removeSection,
} from "./crudSelectionSection";
import { environment } from "@/helpers/getEnvironmentVars";
export interface SectionSelectionState {
  selectedSections: SelectedSection[];
  message: string;
}

const initialState: SectionSelectionState = {
  selectedSections: [],
  message: "",
};

// Fetch selected sections for a specific term or all terms
export const fetchSelectedSectionsAsync = createAsyncThunk(
  "sections/fetchSections",
  async (term: CourseTerm) => {
    try {
      const response = await fetchSections(term);
      return response.selectedSections;
    } catch (error) {
      if (environment === "dev") {
        console.error("Error fetching sections:", error);
      }
      throw error;
    }
  }
);

export const createOrUpdateSelectedSectionAsync = createAsyncThunk(
  "sections/createOrUpdateSelectedSection",
  async ({ section }: { section: SectionDetail }) => {
    try {
      const selectedSectionItem =
        transformSectionToSelectedSectionItem(section);
      const response = await createOrUpdateSection(selectedSectionItem);
      return response;
    } catch (error) {
      if (environment === "dev") {
        console.error("Error creating or updating section:", error);
      }
      throw error;
    }
  }
);

export const removeSelectedSectionAsync = createAsyncThunk(
  "sections/removeSelectedSection",
  async ({ sectionId, term }: { sectionId: number; term: CourseTerm }) => {
    try {
      const response = await removeSection(sectionId, term);
      return response;
    } catch (error) {
      if (environment === "dev") {
        console.error("Error removing section:", error);
      }
      throw error;
    }
  }
);

const sectionSelectionSlice = createSlice({
  name: "sectionSelection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSelectedSectionsAsync.fulfilled, (state, action) => {
      state.selectedSections = action.payload;
    });
    builder.addCase(
      createOrUpdateSelectedSectionAsync.fulfilled,
      (state, action) => {
        state.selectedSections = action.payload.selectedSections;
        state.message = action.payload.message;
      }
    );
    builder.addCase(removeSelectedSectionAsync.fulfilled, (state, action) => {
      state.selectedSections = action.payload.selectedSections;
      state.message = action.payload.message;
    });
  },
});

export const sectionSelectionReducer = sectionSelectionSlice.reducer;
