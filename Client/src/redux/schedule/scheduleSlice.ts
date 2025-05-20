import { environment } from "@/helpers/getEnvironmentVars";
import {
  ScheduleListItem,
  CourseTerm,
  GeneratedSchedule,
  CustomScheduleEvent,
  SelectedSection,
} from "@polylink/shared/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSchedules,
  createOrUpdateSchedule,
  removeSchedule,
  getScheduleById,
  updateSchedule,
} from "./crudSchedule";
import { scheduleToGeneratedSchedule } from "@/components/scheduleBuilder/helpers/scheduleTransformers";
import { RootState } from "../store";

export interface Preferences {
  minUnits?: string;
  maxUnits?: string;
  minInstructorRating?: string;
  maxInstructorRating?: string;
  timeRange?: string;
  openOnly: boolean;
  withTimeConflicts: boolean;
}

export interface ScheduleState {
  currentScheduleId: string | undefined;
  scheduleList: ScheduleListItem[];
  primaryScheduleId: string;
  currentSchedule: GeneratedSchedule | null;
  message: string;
  schedules: GeneratedSchedule[];
  page: number;
  totalPages: number;
  fetchSchedulesLoading: boolean;
  preferences: Preferences;
  currentScheduleTerm: CourseTerm;
  hiddenSections: number[];
}

const initialState: ScheduleState = {
  currentScheduleId: undefined,
  scheduleList: [],
  primaryScheduleId: "",
  currentSchedule: null,
  message: "",
  page: 1,
  totalPages: 1,
  schedules: [],
  fetchSchedulesLoading: false,
  currentScheduleTerm: "fall2025",
  preferences: {
    minUnits: "",
    maxUnits: "",
    minInstructorRating: "",
    maxInstructorRating: "",
    timeRange: "",
    openOnly: false,
    withTimeConflicts: false,
  },
  hiddenSections: [],
};

// Fetch schedules for a specific term
export const fetchSchedulesAsync = createAsyncThunk(
  "schedule/fetchSchedules",
  async (term: CourseTerm) => {
    try {
      const response = await fetchSchedules(term);
      return {
        schedules: response.schedules,
        primaryScheduleId: response.primaryScheduleId,
        term,
      };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error fetching schedules:", error);
      }
      throw error;
    }
  }
);

// Create or update schedule
export const createOrUpdateScheduleAsync = createAsyncThunk(
  "schedule/createOrUpdateSchedule",
  async ({
    classNumbers,
    term,
    scheduleId,
    customEvents,
  }: {
    classNumbers: number[];
    term: CourseTerm;
    scheduleId: string | undefined;
    customEvents?: CustomScheduleEvent[];
  }) => {
    try {
      const response = await createOrUpdateSchedule(
        classNumbers,
        term,
        scheduleId,
        customEvents
      );
      return {
        schedules: response.schedules,
        primaryScheduleId: response.primaryScheduleId,
        term,
        scheduleId: response.scheduleId,
      };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error creating or updating schedule:", error);
      }
      throw error;
    }
  }
);

// Update schedule list item
export const updateScheduleAsync = createAsyncThunk(
  "schedule/updateSchedule",
  async ({
    schedule,
    primaryScheduleId,
    name,
    term,
  }: {
    schedule: ScheduleListItem;
    primaryScheduleId: string;
    name: string;
    term: CourseTerm;
  }) => {
    try {
      const response = await updateSchedule(
        schedule,
        primaryScheduleId,
        name,
        term
      );
      return {
        schedules: response.schedules,
        primaryScheduleId: response.primaryScheduleId,
        term,
        name: response.name,
        scheduleId: response.scheduleId,
      };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error updating schedule:", error);
      }
      throw error;
    }
  }
);

// Get schedule by id
export const getScheduleByIdAsync = createAsyncThunk(
  "schedule/getScheduleById",
  async (scheduleId: string) => {
    try {
      const schedule = await getScheduleById(scheduleId);
      const generatedSchedule = scheduleToGeneratedSchedule(schedule);

      // If the schedule has a term, update the currentScheduleTerm
      if (schedule.term) {
        return {
          schedule: generatedSchedule,
          term: schedule.term,
        };
      }

      return {
        schedule: generatedSchedule,
        term: "spring2025",
      };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error getting schedule by id:", error);
      }
      throw error;
    }
  }
);

export const updateScheduleSections = createAsyncThunk(
  "schedule/updateScheduleSections",
  async (sections: SelectedSection[], { getState }) => {
    const state = getState() as RootState;
    if (!state.schedule.currentSchedule) return;

    return {
      ...state.schedule.currentSchedule,
      sections: [...sections],
      averageRating: state.schedule.currentSchedule.averageRating || 0,
    };
  }
);

// Remove schedule
export const removeScheduleAsync = createAsyncThunk(
  "schedule/removeSchedule",
  async ({ scheduleId, term }: { scheduleId: string; term: CourseTerm }) => {
    try {
      const response = await removeSchedule(scheduleId, term);
      return {
        schedules: response.schedules,
        primaryScheduleId: response.primaryScheduleId,
        term,
      };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error removing schedule:", error);
      }
      throw error;
    }
  }
);

// Update scheduleId from scheduleBuilderLog
export const updateScheduleIdFromBuilder = createAsyncThunk(
  "schedule/updateScheduleIdFromBuilder",
  async (scheduleId: string) => {
    return scheduleId;
  }
);

export const updateScheduleSection = createAsyncThunk(
  "schedule/updateScheduleSection",
  async (
    { sectionIds, action }: { sectionIds: number[]; action: "add" | "remove" },
    { getState }
  ) => {
    const state = getState() as RootState;
    const { currentSchedule, currentScheduleId, currentScheduleTerm } =
      state.schedule;
    const { selectedSections } = state.sectionSelection;

    if (!currentSchedule) {
      throw new Error("No current schedule to update");
    }

    // If we have a currentScheduleId, we need to update the database
    if (currentScheduleId) {
      try {
        // Get the updated sections based on the action
        const updatedSections =
          action === "remove"
            ? currentSchedule.sections.filter(
                (section) => !sectionIds.includes(section.classNumber)
              )
            : [
                ...currentSchedule.sections,
                ...sectionIds.map(
                  (id) => selectedSections.find((s) => s.classNumber === id)!
                ),
              ];

        // Make the API call to update the schedule
        await createOrUpdateSchedule(
          updatedSections.map((section) => section.classNumber),
          currentScheduleTerm,
          currentScheduleId,
          currentSchedule.customEvents
        );

        return {
          ...currentSchedule,
          sections: updatedSections,
        };
      } catch (error) {
        if (environment === "dev") {
          console.error("Error updating schedule section:", error);
        }
        throw error;
      }
    } else {
      // If no currentScheduleId, just update the local state
      return {
        ...currentSchedule,
        sections:
          action === "remove"
            ? currentSchedule.sections.filter(
                (section) => !sectionIds.includes(section.classNumber)
              )
            : [
                ...currentSchedule.sections,
                ...sectionIds.map(
                  (id) => selectedSections.find((s) => s.classNumber === id)!
                ),
              ],
      };
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setCurrentScheduleId(state, action: PayloadAction<string | undefined>) {
      state.currentScheduleId = action.payload;
    },
    setSchedules(state, action) {
      state.schedules = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
    setCurrentSchedule(state, action) {
      state.currentSchedule = action.payload;
    },
    setPreferences(state, action) {
      state.preferences = action.payload;
    },
    setCurrentScheduleTerm(state, action: PayloadAction<CourseTerm>) {
      state.currentScheduleTerm = action.payload;
      state.page = 1;
      state.totalPages = 1;
      state.schedules = [];
      state.currentSchedule = null;
    },
    toggleHiddenSection(state, action: PayloadAction<number>) {
      const classNumber = action.payload;
      // Toggle the visibility of a section by adding it to or removing it from the hiddenSections array.
      const index = state.hiddenSections.indexOf(classNumber);
      if (index === -1) {
        state.hiddenSections.push(classNumber);
      } else {
        state.hiddenSections.splice(index, 1);
      }
    },
    upsertCustomEvent(state, action: PayloadAction<CustomScheduleEvent>) {
      if (!state.currentSchedule) return;
      const list = state.currentSchedule.customEvents ?? [];
      const idx = list.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        list[idx] = action.payload;
      } else {
        list.push(action.payload);
      }
      state.currentSchedule.customEvents = list;
    },
    removeCustomEvent(state, action: PayloadAction<string>) {
      if (state.currentSchedule?.customEvents) {
        state.currentSchedule.customEvents =
          state.currentSchedule.customEvents.filter(
            (event) => event.id !== action.payload
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedulesAsync.pending, (state) => {
        state.fetchSchedulesLoading = true;
      })
      .addCase(fetchSchedulesAsync.fulfilled, (state, action) => {
        state.scheduleList = action.payload.schedules;
        state.primaryScheduleId = action.payload.primaryScheduleId;
        state.fetchSchedulesLoading = false;
      })
      .addCase(fetchSchedulesAsync.rejected, (state) => {
        state.fetchSchedulesLoading = false;
      })
      .addCase(createOrUpdateScheduleAsync.fulfilled, (state, action) => {
        state.scheduleList = action.payload.schedules;
        state.primaryScheduleId = action.payload.primaryScheduleId;

        if (action.payload.scheduleId) {
          state.currentScheduleId = action.payload.scheduleId;
        }
      })
      .addCase(updateScheduleAsync.fulfilled, (state, action) => {
        state.scheduleList = action.payload.schedules;
        state.primaryScheduleId = action.payload.primaryScheduleId;
        if (
          state.currentSchedule &&
          state.currentSchedule.id === action.payload.scheduleId
        ) {
          state.currentSchedule = {
            ...state.currentSchedule,
            name: action.payload.name,
          };
        }
      })
      .addCase(getScheduleByIdAsync.fulfilled, (state, action) => {
        state.currentSchedule = action.payload.schedule;
        state.currentScheduleId = action.payload.schedule.id;
        state.page = 1;
        state.totalPages = 1;
        if (action.payload.term) {
          state.currentScheduleTerm = action.payload.term as CourseTerm;
        }
      })
      .addCase(removeScheduleAsync.fulfilled, (state, action) => {
        state.scheduleList = action.payload.schedules;
        state.primaryScheduleId = action.payload.primaryScheduleId;
        if (state.currentScheduleId === action.meta.arg.scheduleId) {
          state.currentScheduleId = undefined;
          state.currentSchedule = null;
        }
      })
      .addCase(updateScheduleIdFromBuilder.fulfilled, (state, action) => {
        state.currentScheduleId = action.payload;
      })
      .addCase(updateScheduleSections.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentSchedule = action.payload;
        }
      })
      .addCase(updateScheduleSection.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentSchedule = action.payload;
        }
      });
  },
});

export const {
  setCurrentScheduleId,
  setPage,
  setTotalPages,
  setSchedules,
  setCurrentSchedule,
  setPreferences,
  setCurrentScheduleTerm,
  toggleHiddenSection,
  upsertCustomEvent,
  removeCustomEvent,
} = scheduleSlice.actions;

export const scheduleReducer = scheduleSlice.reducer;
