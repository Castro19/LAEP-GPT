import { environment } from "@/helpers/getEnvironmentVars";
import {
  Calendar,
  CalendarListItem,
  SelectedSection,
} from "@polylink/shared/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCalendars,
  createOrUpdateCalendar,
  removeCalendar,
  getCalendarById,
  updateCalendar,
} from "./crudCalendar";

export interface Preferences {
  minUnits: string;
  maxUnits: string;
  minInstructorRating: string;
  maxInstructorRating: string;
  timeRange: string;
  showOnlyOpenClasses?: boolean;
  useCurrentSchedule?: boolean;
  showOverlappingClasses?: boolean;
}

interface calendarState {
  page: number;
  totalPages: number;
  calendars: { sections: SelectedSection[]; averageRating: number }[];
  calendarList: CalendarListItem[];
  currentCalendar: Calendar | null;
  primaryCalendarId: string;
  loading: boolean;
  preferences: Preferences;
}

const initialState: calendarState = {
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
    showOnlyOpenClasses: undefined,
    useCurrentSchedule: undefined,
    showOverlappingClasses: undefined,
  },
};

// When calling fetchSections, pass page and pageSize too.
export const fetchCalendarsAsync = createAsyncThunk(
  "calendars/fetchCalendars",
  async () => {
    try {
      const response = await fetchCalendars();
      const { calendars, primaryCalendarId } = response;
      return { calendars, primaryCalendarId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error fetching calendars:", error);
      }
      throw error;
    }
  }
);

export const createOrUpdateCalendarAsync = createAsyncThunk(
  "calendars/createOrUpdateCalendar",
  async (sections: SelectedSection[]) => {
    try {
      const response = await createOrUpdateCalendar(sections);
      const { calendars, primaryCalendarId } = response;
      return { calendars, primaryCalendarId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error creating or updating calendar:", error);
      }
      throw error;
    }
  }
);

// Calendar Item
export const removeCalendarAsync = createAsyncThunk(
  "calendars/removeCalendar",
  async (calendarId: string) => {
    try {
      const response = await removeCalendar(calendarId);
      const { calendars, primaryCalendarId } = response;
      return { calendars, primaryCalendarId, calendarId };
    } catch (error) {
      if (environment === "dev") {
        console.error("Error removing calendar:", error);
      }
      throw error;
    }
  }
);

export const getCalendarByIdAsync = createAsyncThunk(
  "calendars/getCalendarById",
  async (calendarId: string) => {
    try {
      const response = await getCalendarById(calendarId);
      return response;
    } catch (error) {
      if (environment === "dev") {
        console.error("Error getting calendar by id:", error);
      }
      throw error;
    }
  }
);

export const updateCalendarAsync = createAsyncThunk(
  "calendars/updateCalendar",
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

const calendarSlice = createSlice({
  name: "calendar",
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
    builder.addCase(fetchCalendarsAsync.fulfilled, (state, action) => {
      state.calendarList = action.payload.calendars;
      state.primaryCalendarId = action.payload.primaryCalendarId;
    });
    // Create or Update Calendar
    builder.addCase(createOrUpdateCalendarAsync.fulfilled, (state, action) => {
      state.primaryCalendarId = action.payload.primaryCalendarId;
      state.calendarList = action.payload.calendars;
    });
    // Remove Calendar
    builder.addCase(removeCalendarAsync.fulfilled, (state, action) => {
      state.calendarList = state.calendarList.filter(
        (calendar) => calendar.id !== action.payload.calendarId
      );
      state.primaryCalendarId = action.payload.primaryCalendarId;
    });
    // Get Calendar By Id
    builder.addCase(getCalendarByIdAsync.fulfilled, (state, action) => {
      state.currentCalendar = action.payload;
    });
    // Update Calendar
    builder.addCase(updateCalendarAsync.fulfilled, (state, action) => {
      state.calendarList = action.payload.calendars;
      state.primaryCalendarId = action.payload.primaryCalendarId;
    });
  },
});

export const {
  setPage,
  setTotalPages,
  setCalendars,
  setCurrentCalendar,
  setPreferences,
} = calendarSlice.actions;

export const calendarReducer = calendarSlice.reducer;
