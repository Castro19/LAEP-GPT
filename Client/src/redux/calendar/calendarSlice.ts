import { environment } from "@/helpers/getEnvironmentVars";
import { Calendar } from "@polylink/shared/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCalendars,
  createOrUpdateCalendar,
  removeCalendar,
} from "./crudCalendar";
interface calendarState {
  page: number;
  totalPages: number;
  calendars: Calendar[];
  loading: boolean;
}

const initialState: calendarState = {
  page: 1,
  totalPages: 1,
  calendars: [],
  loading: false,
};

// When calling fetchSections, pass page and pageSize too.
export const fetchCalendarsAsync = createAsyncThunk(
  "calendars/fetchCalendars",
  async () => {
    try {
      const response = await fetchCalendars();

      return response.calendars;
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
  async (calendar: Calendar) => {
    try {
      const response = await createOrUpdateCalendar(calendar);
      return response;
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
      return response;
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
    setPage(state, action) {
      state.page = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCalendarsAsync.fulfilled, (state, action) => {
      state.calendars = action.payload;
    });
    builder.addCase(createOrUpdateCalendarAsync.fulfilled, (state, action) => {
      state.calendars = [...state.calendars, action.payload.calendar];
    });
    builder.addCase(removeCalendarAsync.fulfilled, (state, action) => {
      state.calendars = state.calendars.filter(
        (calendar) => calendar.id !== action.payload.calendarId
      );
    });
  },
});

export const { setPage, setTotalPages } = calendarSlice.actions;

export const calendarReducer = calendarSlice.reducer;
