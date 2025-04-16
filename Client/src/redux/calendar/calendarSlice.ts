import { environment } from "@/helpers/getEnvironmentVars";
import {
  Calendar,
  CalendarListItem,
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
  calendars: {
    sections: SelectedSection[];
    averageRating: number;
    withConflicts?: boolean;
    conflictGroups?: SelectedSection[];
  }[];
  calendarList: CalendarListItem[];
  currentCalendar: Calendar | null;
  primaryCalendarId: string;
  loading: boolean;
  preferences: Preferences;
}

const initialState: ScheduleState = {
  page: 1,
  totalPages: 1,
  calendars: [],
  calendarList: [],
  currentCalendar: null,
  primaryCalendarId: "",
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
      const { schedules, primaryCalendarId } = response;
      return { schedules, primaryCalendarId };
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
      const { schedules, primaryCalendarId } = response;
      return { schedules, primaryCalendarId };
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
      const { schedules, primaryCalendarId } = response;
      return { schedules, primaryCalendarId, scheduleId };
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
    primaryCalendarId,
    name,
  }: {
    schedule: Calendar;
    primaryCalendarId: string;
    name: string;
  }) => {
    try {
      const response = await updateSchedule(schedule, primaryCalendarId, name);
      const { schedules, primaryCalendarId: newPrimaryCalendarId } = response;

      return { schedules, primaryCalendarId: newPrimaryCalendarId };
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
    setCalendars(state, action) {
      state.calendars = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
    setCurrentCalendar(state, action) {
      state.currentCalendar = action.payload;
    },
    setPreferences(state, action) {
      state.preferences = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Calendar List
    builder.addCase(fetchSchedulesAsync.fulfilled, (state, action) => {
      state.primaryCalendarId = action.payload.primaryCalendarId;
      const scheduleList = action.payload.schedules;
      const primaryCalendar = scheduleList.find(
        (schedule) => schedule.id === state.primaryCalendarId
      );
      if (primaryCalendar) {
        // Put the primary calendar at the top of the list
        const otherCalendars = scheduleList.filter(
          (schedule) => schedule.id !== state.primaryCalendarId
        );
        state.calendarList = [primaryCalendar, ...otherCalendars];
      } else {
        state.calendarList = scheduleList;
      }
    });
    // Create or Update Calendar
    builder.addCase(createOrUpdateSchedulesAsync.fulfilled, (state, action) => {
      state.primaryCalendarId = action.payload.primaryCalendarId;
      state.calendarList = action.payload.schedules;
    });
    // Remove Calendar
    builder.addCase(removeScheduleAsync.fulfilled, (state, action) => {
      const scheduleList = action.payload.schedules;
      const primaryCalendarId = action.payload.primaryCalendarId;
      const primaryCalendar = scheduleList.find(
        (schedule) => schedule.id === primaryCalendarId
      );
      if (primaryCalendar) {
        // Put the primary calendar at the top of the list
        const otherCalendars = scheduleList.filter(
          (schedule) => schedule.id !== primaryCalendarId
        );
        state.calendarList = [primaryCalendar, ...otherCalendars];

        state.calendarList = state.calendarList.filter(
          (schedule) => schedule.id !== action.payload.scheduleId
        );
        state.primaryCalendarId = action.payload.primaryCalendarId;
      } else {
        state.calendarList = scheduleList;
        state.primaryCalendarId = "";
      }
    });
    // Get Calendar By Id
    builder.addCase(getScheduleByIdAsync.fulfilled, (state, action) => {
      state.currentCalendar = action.payload;
    });
    // Update Calendar
    builder.addCase(updateScheduleAsync.fulfilled, (state, action) => {
      state.calendarList = action.payload.schedules;
      state.primaryCalendarId = action.payload.primaryCalendarId;
      const primaryCalendar = state.calendarList.find(
        (schedule) => schedule.id === action.payload.primaryCalendarId
      );
      if (primaryCalendar) {
        // Re order the calendar list
        const otherCalendars = state.calendarList.filter(
          (schedule) => schedule.id !== action.payload.primaryCalendarId
        );
        state.calendarList = [primaryCalendar, ...otherCalendars];
      }
    });
  },
});

export const {
  setPage,
  setTotalPages,
  setCalendars,
  setCurrentCalendar,
  setPreferences,
} = scheduleSlice.actions;

export const scheduleReducer = scheduleSlice.reducer;
