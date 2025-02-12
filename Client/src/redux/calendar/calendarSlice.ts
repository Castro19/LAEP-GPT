import { environment } from "@/helpers/getEnvironmentVars";
import { Calendar, SelectedSection } from "@polylink/shared/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCalendars,
  createOrUpdateCalendar,
  removeCalendar,
} from "./crudCalendar";
interface calendarState {
  page: number;
  totalPages: number;
  calendars: { sections: SelectedSection[]; averageRating: number }[];
  scheduleList: Calendar[];
  currentCalendar: Calendar | null;
  primaryCalendarId: number;
  loading: boolean;
}

const initialState: calendarState = {
  page: 1,
  totalPages: 1,
  calendars: [],
  scheduleList: [],
  currentCalendar: null,
  primaryCalendarId: 0,
  loading: false,
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

export const removeCalendarAsync = createAsyncThunk(
  "calendars/removeCalendar",
  async (calendarId: number) => {
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCalendarsAsync.fulfilled, (state, action) => {
      state.scheduleList = action.payload.calendars;
      state.primaryCalendarId = action.payload.primaryCalendarId;
    });
    builder.addCase(createOrUpdateCalendarAsync.fulfilled, (state, action) => {
      state.primaryCalendarId = action.payload.primaryCalendarId;
      state.scheduleList = action.payload.calendars;
    });
    builder.addCase(removeCalendarAsync.fulfilled, (state, action) => {
      state.scheduleList = state.scheduleList.filter(
        (calendar) => calendar.id !== action.payload.calendarId
      );
      state.primaryCalendarId = action.payload.primaryCalendarId;
    });
  },
});

export const { setPage, setTotalPages, setCalendars } = calendarSlice.actions;

export const calendarReducer = calendarSlice.reducer;
