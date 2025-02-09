import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SectionDetail, SelectedSection } from "@polylink/shared/types";
import {
  fetchSections,
  createOrUpdateSection,
  transformSectionToSelectedSection,
  removeSection,
} from "./crudSelectionSection";
import { environment } from "@/helpers/getEnvironmentVars";
interface SectionSelectionState {
  selectedSections: SelectedSection[];
  message: string;
}

const initialState: SectionSelectionState = {
  selectedSections: [],
  message: "",
};

// When calling fetchSections, pass page and pageSize too.
export const fetchSelectedSectionsAsync = createAsyncThunk(
  "sections/fetchSections",
  async () => {
    try {
      const response = await fetchSections();

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
  async (section: SectionDetail) => {
    try {
      const selectedSection = transformSectionToSelectedSection(section);
      const response = await createOrUpdateSection(selectedSection);
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
  async (sectionId: number) => {
    try {
      const response = await removeSection(sectionId);
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
