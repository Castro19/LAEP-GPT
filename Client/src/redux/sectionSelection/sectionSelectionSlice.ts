import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SectionDetail, SelectedSection } from "@polylink/shared/types";
import {
  fetchSections,
  createOrUpdateSection,
  transformSectionToSelectedSection,
} from "./crudSelectionSection";
interface SectionSelectionState {
  selectedSections: SelectedSection[];
}

const initialState: SectionSelectionState = {
  selectedSections: [],
};

// When calling fetchSections, pass page and pageSize too.
export const fetchSelectedSectionsAsync = createAsyncThunk(
  "sections/fetchSections",
  async () => {
    try {
      const response = await fetchSections();
      console.log("RESPONSE", response);
      return response.selectedSections;
    } catch (error) {
      console.error("Error fetching sections:", error);
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
      return response.selectedSections;
    } catch (error) {
      console.error("Error creating or updating section:", error);
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
        state.selectedSections = action.payload;
      }
    );
  },
});

export const sectionSelectionReducer = sectionSelectionSlice.reducer;
