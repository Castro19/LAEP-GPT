import { serverUrl } from "@/helpers/getEnvironmentVars";
import {
  Calendar,
  CalendarListItem,
  SelectedSection,
} from "@polylink/shared/types";

// Calendar List
export async function fetchCalendars(): Promise<{
  calendars: CalendarListItem[];
  primaryCalendarId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/calendars`, {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching calendars:", error);
    throw error;
  }
}

export async function createOrUpdateCalendar(
  sections: SelectedSection[]
): Promise<{
  calendars: CalendarListItem[];
  primaryCalendarId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/calendars`, {
      method: "POST",
      body: JSON.stringify({ sections }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating or updating calendar:", error);
    throw error;
  }
}

// Calendar Item

export async function getCalendarById(calendarId: string): Promise<Calendar> {
  try {
    const response = await fetch(`${serverUrl}/calendars/${calendarId}`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!data.calendar) {
      throw new Error("Calendar not found");
    }
    return data.calendar;
  } catch (error) {
    console.error("Error getting calendar by id:", error);
    throw error;
  }
}

export async function removeCalendar(calendarId: string): Promise<{
  calendars: CalendarListItem[];
  primaryCalendarId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/calendars/${calendarId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing calendar:", error);
    throw error;
  }
}
