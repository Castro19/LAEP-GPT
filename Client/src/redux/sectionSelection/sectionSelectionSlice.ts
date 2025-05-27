import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  SectionDetail,
  SelectedSection,
  CourseTerm,
  SelectedSectionItem,
} from "@polylink/shared/types";
import {
  fetchSections,
  createOrUpdateSection,
  removeSection,
  transformSectionDetailToSelectedSectionItem,
  bulkAddSelectedSections,
} from "./crudSelectionSection";
import { environment } from "@/helpers/getEnvironmentVars";
import { RootState } from "../store";
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

export const bulkAddSelectedSectionsAsync = createAsyncThunk(
  "sections/bulkAddSelectedSections",
  async (sectionsToAdd: SelectedSectionItem[]) => {
    try {
      const response = await bulkAddSelectedSections(sectionsToAdd);
      return response.selectedSections;
    } catch (error) {
      if (environment === "dev") {
        console.error("Error adding selected sections:", error);
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
  async (sections: SelectedSection[], { getState }) => {
    const state = getState() as RootState;
    const currentSelectedSections = state.sectionSelection.selectedSections;
    const classNumsInCurrentSelectedSections = currentSelectedSections.map(
      (s) => s.classNumber
    );
    const classNumsInNewSections = sections.map((s) => s.classNumber);

    const classNumsToAdd = classNumsInNewSections.filter(
      (cn) => !classNumsInCurrentSelectedSections.includes(cn)
    );

    // Only add sections whose class numbers are in classNumsToAdd
    const newSections = sections.filter((section) =>
      classNumsToAdd.includes(section.classNumber)
    );

    return [...currentSelectedSections, ...newSections];
  }
);

export const addNewSectionsAndUpdateSelected = createAsyncThunk(
  "sections/addNewSectionsAndUpdateSelected",
  async (
    { classNums, term }: { classNums: number[]; term: CourseTerm },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const selectedSections = state.sectionSelection.selectedSections;

    // First, identify sections that need to be added
    const newSectionsToAdd: SelectedSectionItem[] = classNums
      .filter((id) => !selectedSections.some((s) => s.classNumber === id))
      .map((id) => ({
        sectionId: id,
        term,
      }));

    // If we have new sections to add, add them first
    if (newSectionsToAdd.length > 0) {
      // Wait for the bulk add to complete and get the updated sections
      const updatedSections = await dispatch(
        bulkAddSelectedSectionsAsync(newSectionsToAdd)
      ).unwrap();

      // Find the sections we want to add from the updated sections
      const sectionsToAdd = classNums
        .map((id) => updatedSections.find((s) => s.classNumber === id))
        .filter(Boolean) as SelectedSection[];

      // Update the selected sections with the new sections
      if (sectionsToAdd.length > 0) {
        await dispatch(updateSelectedSections(sectionsToAdd));
      }

      return sectionsToAdd;
    }

    // If no new sections to add, just return the existing sections
    return classNums
      .map((id) => selectedSections.find((s) => s.classNumber === id))
      .filter(Boolean) as SelectedSection[];
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
