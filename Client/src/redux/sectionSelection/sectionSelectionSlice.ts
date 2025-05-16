import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  SectionDetail,
  SelectedSection,
  CourseTerm,
} from "@polylink/shared/types";
import {
  fetchSections,
  createOrUpdateSection,
  removeSection,
  transformSectionDetailToSelectedSectionItem,
} from "./crudSelectionSection";
import { environment } from "@/helpers/getEnvironmentVars";
export interface SectionSelectionState {
  selectedSections: SelectedSection[];
  sectionsForSchedule: SelectedSection[];
  message: string;
  fetchSelectedSectionsLoading: boolean;
}

const initialState: SectionSelectionState = {
  selectedSections: [],
  sectionsForSchedule: [],
  message: "",
  fetchSelectedSectionsLoading: false,
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
        transformSectionDetailToSelectedSectionItem(section);
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

export const updateSelectedSections = createAsyncThunk(
  "sections/updateSelectedSections",
  async (sections: SelectedSection[]) => {
    return sections;
  }
);

const sectionSelectionSlice = createSlice({
  name: "sectionSelection",
  initialState,
  reducers: {
    toggleSectionForSchedule: (state, action) => {
      const sectionId = action.payload;
      const section = state.selectedSections.find(
        (s) => s.classNumber === sectionId
      );

      if (section) {
        const isAlreadySelected = state.sectionsForSchedule.some(
          (s) => s.classNumber === sectionId
        );

        if (isAlreadySelected) {
          state.sectionsForSchedule = state.sectionsForSchedule.filter(
            (s) => s.classNumber !== sectionId
          );
        } else {
          state.sectionsForSchedule.push(section);
        }
      }
    },
    selectAllSectionsForSchedule: (state) => {
      state.sectionsForSchedule = state.selectedSections.filter(
        (section) => section
      );
    },
    deselectAllSectionsForSchedule: (state) => {
      state.sectionsForSchedule = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelectedSectionsAsync.pending, (state) => {
        state.fetchSelectedSectionsLoading = true;
      })
      .addCase(fetchSelectedSectionsAsync.fulfilled, (state, action) => {
        state.selectedSections = action.payload;
        state.fetchSelectedSectionsLoading = false;
        state.sectionsForSchedule = action.payload;
      })
      .addCase(fetchSelectedSectionsAsync.rejected, (state) => {
        state.fetchSelectedSectionsLoading = false;
      });
    builder.addCase(
      createOrUpdateSelectedSectionAsync.fulfilled,
      (state, action) => {
        state.selectedSections = action.payload.selectedSections;
        state.message = action.payload.message;
      }
    );
    builder
      .addCase(removeSelectedSectionAsync.pending, (state, action) => {
        // Remove the section from both arrays immediately for better UX
        const sectionId = action.meta.arg.sectionId;

        // Remove from selectedSections
        state.selectedSections = state.selectedSections.filter(
          (section) => section.classNumber !== sectionId
        );

        // Remove from sectionsForSchedule
        state.sectionsForSchedule = state.sectionsForSchedule.filter(
          (section) => section.classNumber !== sectionId
        );
      })
      .addCase(removeSelectedSectionAsync.fulfilled, (state, action) => {
        // Update with the server response
        state.selectedSections = action.payload.selectedSections;
        state.message = action.payload.message;
        state.fetchSelectedSectionsLoading = false;
      });
    builder.addCase(updateSelectedSections.fulfilled, (state, action) => {
      state.selectedSections = action.payload;
    });
  },
});

export const {
  toggleSectionForSchedule,
  selectAllSectionsForSchedule,
  deselectAllSectionsForSchedule,
} = sectionSelectionSlice.actions;
export const sectionSelectionReducer = sectionSelectionSlice.reducer;
