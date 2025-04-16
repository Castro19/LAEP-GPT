import { environment } from "@/helpers/getEnvironmentVars";
import {
  Schedule,
  ScheduleListItem,
  SelectedSection,
} from "@polylink/shared/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchSchedules,
  createOrUpdateSchedule,
  removeSchedule,
  getScheduleById,
  updateSchedule,
} from "./crudCalendar";

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
  page: number;
  totalPages: number;
  schedules: {
    sections: SelectedSection[];
    averageRating: number;
    withConflicts?: boolean;
    conflictGroups?: SelectedSection[];
  }[];
  scheduleList: ScheduleListItem[];
  currentSchedule: Schedule | null;
  primaryScheduleId: string;
  loading: boolean;
  preferences: Preferences;
}

const initialState: ScheduleState = {
  page: 1,
  totalPages: 1,
  schedules: [],
  scheduleList: [],
  currentSchedule: null,
  primaryScheduleId: "",
  loading: false,
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

// When calling fetchSections, pass page and pageSize too.
export const fetchSchedulesAsync = createAsyncThunk(
  "calendars/fetchSchedules",
  async () => {
    try {
      const response = await fetchSchedules();
      const { schedules, primaryScheduleId } = response;
      return { schedules, primaryScheduleId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error fetching schedules:", error);
      }
      throw error;
    }
  }
);

export const createOrUpdateSchedulesAsync = createAsyncThunk(
  "calendars/createOrUpdateSchedule",
  async (sections: SelectedSection[]) => {
    try {
      const response = await createOrUpdateSchedule(sections);
      const { schedules, primaryScheduleId } = response;
      return { schedules, primaryScheduleId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error creating or updating schedule:", error);
      }
      throw error;
    }
  }
);

// Calendar Item
export const removeScheduleAsync = createAsyncThunk(
  "calendars/removeSchedule",
  async (scheduleId: string) => {
    try {
      const response = await removeSchedule(scheduleId);
      const { schedules, primaryScheduleId } = response;
      return { schedules, primaryScheduleId, scheduleId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error removing schedule:", error);
      }
      throw error;
    }
  }
);

export const getScheduleByIdAsync = createAsyncThunk(
  "calendars/getScheduleById",
  async (scheduleId: string) => {
    try {
      const response = await getScheduleById(scheduleId);
      return response;
    } catch (error) {
      if (environment === "dev") {
        console.error("Error getting schedule by id:", error);
      }
      throw error;
    }
  }
);

export const updateScheduleAsync = createAsyncThunk(
  "calendars/updateSchedule",
  async ({
    schedule,
    primaryScheduleId,
    name,
  }: {
    schedule: Schedule;
    primaryScheduleId: string;
    name: string;
  }) => {
    try {
      const response = await updateSchedule(schedule, primaryScheduleId, name);
      const { schedules, primaryScheduleId: newPrimaryScheduleId } = response;

      return { schedules, primaryScheduleId: newPrimaryScheduleId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error updating schedule:", error);
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
  },
  extraReducers: (builder) => {
    // Fetch Calendar List
    builder.addCase(fetchSchedulesAsync.fulfilled, (state, action) => {
      state.primaryScheduleId = action.payload.primaryScheduleId;
      const scheduleList = action.payload.schedules;
      const primarySchedule = scheduleList.find(
        (schedule) => schedule.id === state.primaryScheduleId
      );
      if (primarySchedule) {
        // Put the primary schedule at the top of the list
        const otherSchedules = scheduleList.filter(
          (schedule) => schedule.id !== state.primaryScheduleId
        );
        state.scheduleList = [primarySchedule, ...otherSchedules];
      } else {
        state.scheduleList = scheduleList;
      }
    });
    // Create or Update Calendar
    builder.addCase(createOrUpdateSchedulesAsync.fulfilled, (state, action) => {
      state.primaryScheduleId = action.payload.primaryScheduleId;
      state.scheduleList = action.payload.schedules;
    });
    // Remove Calendar
    builder.addCase(removeScheduleAsync.fulfilled, (state, action) => {
      const scheduleList = action.payload.schedules;
      const primaryScheduleId = action.payload.primaryScheduleId;
      const primarySchedule = scheduleList.find(
        (schedule) => schedule.id === primaryScheduleId
      );
      if (primarySchedule) {
        // Put the primary schedule at the top of the list
        const otherSchedules = scheduleList.filter(
          (schedule) => schedule.id !== primaryScheduleId
        );
        state.scheduleList = [primarySchedule, ...otherSchedules];

        state.scheduleList = state.scheduleList.filter(
          (schedule) => schedule.id !== action.payload.scheduleId
        );
        state.primaryScheduleId = action.payload.primaryScheduleId;
      } else {
        state.scheduleList = scheduleList;
        state.primaryScheduleId = "";
      }
    });
    // Get Calendar By Id
    builder.addCase(getScheduleByIdAsync.fulfilled, (state, action) => {
      state.currentSchedule = action.payload;
    });
    // Update Calendar
    builder.addCase(updateScheduleAsync.fulfilled, (state, action) => {
      state.scheduleList = action.payload.schedules;
      state.primaryScheduleId = action.payload.primaryScheduleId;
      const primarySchedule = state.scheduleList.find(
        (schedule) => schedule.id === action.payload.primaryScheduleId
      );
      if (primarySchedule) {
        // Re order the calendar list
        const otherSchedules = state.scheduleList.filter(
          (schedule) => schedule.id !== action.payload.primaryScheduleId
        );
        state.scheduleList = [primarySchedule, ...otherSchedules];
      }
    });
  },
});

export const {
  setPage,
  setTotalPages,
  setSchedules,
  setCurrentSchedule,
  setPreferences,
} = scheduleSlice.actions;

export const scheduleReducer = scheduleSlice.reducer;
