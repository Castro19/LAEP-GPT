import { environment } from "@/helpers/getEnvironmentVars";
import {
  Schedule,
  ScheduleListItem,
  CourseTerm,
  SelectedSection,
  GeneratedSchedule,
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

export interface Preferences {
  minUnits?: string;
  maxUnits?: string;
  minInstructorRating?: string;
  maxInstructorRating?: string;
  timeRange?: string;
  openOnly: boolean;
  useCurrentSchedule: boolean;
  showOverlappingClasses: boolean;
}

export interface ScheduleState {
  scheduleList: ScheduleListItem[];
  primaryScheduleId: string;
  currentSchedule: GeneratedSchedule | null;
  message: string;
  schedules: GeneratedSchedule[];
  page: number;
  totalPages: number;
  loading: boolean;
  preferences: Preferences;
  currentScheduleTerm: CourseTerm;
}

const initialState: ScheduleState = {
  scheduleList: [],
  primaryScheduleId: "",
  currentSchedule: null,
  message: "",
  page: 1,
  totalPages: 1,
  schedules: [],
  loading: false,
  currentScheduleTerm: "spring2025",
  preferences: {
    minUnits: "",
    maxUnits: "",
    minInstructorRating: "",
    maxInstructorRating: "",
    timeRange: "",
    openOnly: false,
    useCurrentSchedule: false,
    showOverlappingClasses: false,
  },
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
    sections,
    term,
  }: {
    sections: SelectedSection[];
    term: CourseTerm;
  }) => {
    try {
      const response = await createOrUpdateSchedule(sections, term);
      return {
        schedules: response.schedules,
        primaryScheduleId: response.primaryScheduleId,
        term,
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
    schedule: Schedule;
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
      return scheduleToGeneratedSchedule(schedule);
    } catch (error) {
      if (environment === "dev") {
        console.error("Error getting schedule by id:", error);
      }
      throw error;
    }
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

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedulesAsync.fulfilled, (state, action) => {
        state.scheduleList = action.payload.schedules;
        state.primaryScheduleId = action.payload.primaryScheduleId;
      })
      .addCase(createOrUpdateScheduleAsync.fulfilled, (state, action) => {
        state.scheduleList = action.payload.schedules;
        state.primaryScheduleId = action.payload.primaryScheduleId;
      })
      .addCase(updateScheduleAsync.fulfilled, (state, action) => {
        state.scheduleList = action.payload.schedules;
        state.primaryScheduleId = action.payload.primaryScheduleId;
      })
      .addCase(getScheduleByIdAsync.fulfilled, (state, action) => {
        state.currentSchedule = action.payload;
      })
      .addCase(removeScheduleAsync.fulfilled, (state, action) => {
        state.scheduleList = action.payload.schedules;
        state.primaryScheduleId = action.payload.primaryScheduleId;
      });
  },
});

export const {
  setPage,
  setTotalPages,
  setSchedules,
  setCurrentSchedule,
  setPreferences,
  setCurrentScheduleTerm,
} = scheduleSlice.actions;

export const scheduleReducer = scheduleSlice.reducer;
