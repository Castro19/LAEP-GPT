import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Section,
  SectionDetail,
  SectionsFilterParams,
  SelectedSection,
} from "@polylink/shared/types";
import {
  fetchSections,
  createOrUpdateSection,
  removeSection,
} from "./crudSelectionSection";
import { transformSectionToSelectedSection } from "@/helpers/transformSection";
import { fetchSections as fetchSectionsFromSection } from "../section/crudSection"; // TODO: Rename this to something else so its not confused with fetchSections in crudSection.ts

import { environment } from "@/helpers/getEnvironmentVars";
interface SectionSelectionState {
  selectedSections: SelectedSection[];
  sidebarSections: Section[];
  sidebarCourseIds: string[];
  message: string;
}

const initialState: SectionSelectionState = {
  selectedSections: [],
  sidebarSections: [],
  sidebarCourseIds: [],
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

export const setSidebarSections = createAsyncThunk(
  "sections/setSidebarSections",
  async (courseIds: string[]) => {
    try {
      const filters: SectionsFilterParams = {
        courseIds,
      };
      const response = await fetchSectionsFromSection(filters, 1);
      const sections = response.data;
      return sections;
    } catch (error) {
      if (environment === "dev") {
        console.error("Error setting sidebar sections:", error);
      }
      throw error;
    }
  }
);

const sectionSelectionSlice = createSlice({
  name: "sectionSelection",
  initialState,
  reducers: {
    addSidebarCourseId: (state, action) => {
      state.sidebarCourseIds.push(action.payload);
    },
    removeSidebarCourseId: (state, action) => {
      state.sidebarCourseIds = state.sidebarCourseIds.filter(
        (id) => id !== action.payload
      );
    },
  },
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
    builder.addCase(setSidebarSections.fulfilled, (state, action) => {
      state.sidebarSections = action.payload;
    });
  },
});

export const { addSidebarCourseId, removeSidebarCourseId } =
  sectionSelectionSlice.actions;
export const sectionSelectionReducer = sectionSelectionSlice.reducer;
