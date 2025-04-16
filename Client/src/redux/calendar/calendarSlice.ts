import { environment } from "@/helpers/getEnvironmentVars";
import {
  Calendar,
  CalendarListItem,
  SelectedSection,
} from "@polylink/shared/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchSchedules,
  createOrUpdateCalendar,
  removeCalendar,
  getCalendarById,
  updateCalendar,
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
      const { calendars, primaryCalendarId } = response;
      return { calendars, primaryCalendarId };
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
      const response = await createOrUpdateCalendar(sections);
      const { calendars, primaryCalendarId } = response;
      return { calendars, primaryCalendarId };
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
  async (calendarId: string) => {
    try {
      const response = await removeCalendar(calendarId);
      const { calendars, primaryCalendarId } = response;
      return { calendars, primaryCalendarId, calendarId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error removing schedule:", error);
      }
      throw error;
    }
  }
);

export const getScheduleByIdAsync = createAsyncThunk(
  "calendars/getCalendarById",
  async (calendarId: string) => {
    try {
      const response = await getCalendarById(calendarId);
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
    calendar,
    primaryCalendarId,
    name,
  }: {
    calendar: Calendar;
    primaryCalendarId: string;
    name: string;
  }) => {
    try {
      const response = await updateCalendar(calendar, primaryCalendarId, name);
      const { calendars, primaryCalendarId: newPrimaryCalendarId } = response;

      return { calendars, primaryCalendarId: newPrimaryCalendarId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error updating calendar:", error);
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
      const calendarList = action.payload.calendars;
      const primaryCalendar = calendarList.find(
        (calendar) => calendar.id === state.primaryCalendarId
      );
      if (primaryCalendar) {
        // Put the primary calendar at the top of the list
        const otherCalendars = calendarList.filter(
          (calendar) => calendar.id !== state.primaryCalendarId
        );
        state.calendarList = [primaryCalendar, ...otherCalendars];
      } else {
        state.calendarList = calendarList;
      }
    });
    // Create or Update Calendar
    builder.addCase(createOrUpdateSchedulesAsync.fulfilled, (state, action) => {
      state.primaryCalendarId = action.payload.primaryCalendarId;
      state.calendarList = action.payload.calendars;
    });
    // Remove Calendar
    builder.addCase(removeScheduleAsync.fulfilled, (state, action) => {
      const calendarList = action.payload.calendars;
      const primaryCalendarId = action.payload.primaryCalendarId;
      const primaryCalendar = calendarList.find(
        (calendar) => calendar.id === primaryCalendarId
      );
      if (primaryCalendar) {
        // Put the primary calendar at the top of the list
        const otherCalendars = calendarList.filter(
          (calendar) => calendar.id !== primaryCalendarId
        );
        state.calendarList = [primaryCalendar, ...otherCalendars];

        state.calendarList = state.calendarList.filter(
          (calendar) => calendar.id !== action.payload.calendarId
        );
        state.primaryCalendarId = action.payload.primaryCalendarId;
      } else {
        state.calendarList = calendarList;
        state.primaryCalendarId = "";
      }
    });
    // Get Calendar By Id
    builder.addCase(getScheduleByIdAsync.fulfilled, (state, action) => {
      state.currentCalendar = action.payload;
    });
    // Update Calendar
    builder.addCase(updateScheduleAsync.fulfilled, (state, action) => {
      state.calendarList = action.payload.calendars;
      state.primaryCalendarId = action.payload.primaryCalendarId;
      const primaryCalendar = state.calendarList.find(
        (calendar) => calendar.id === action.payload.primaryCalendarId
      );
      if (primaryCalendar) {
        // Re order the calendar list
        const otherCalendars = state.calendarList.filter(
          (calendar) => calendar.id !== action.payload.primaryCalendarId
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
