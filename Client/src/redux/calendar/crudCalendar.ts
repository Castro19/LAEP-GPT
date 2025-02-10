import { Calendar } from "@polylink/shared/types";

export async function fetchCalendars() {
  console.log("fetchCalendars");
  return {
    calendars: [],
  };
}

export async function createOrUpdateCalendar(calendar: Calendar) {
  console.log("createOrUpdateCalendar", calendar);
  return {
    calendar,
  };
}

export async function removeCalendar(calendarId: number) {
  console.log("removeCalendar", calendarId);
  return {
    calendarId,
  };
}
