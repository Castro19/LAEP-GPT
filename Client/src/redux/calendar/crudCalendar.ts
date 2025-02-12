import { serverUrl } from "@/helpers/getEnvironmentVars";
import { Calendar, SelectedSection } from "@polylink/shared/types";

export async function fetchCalendars(): Promise<{
  calendars: Calendar[];
  primaryCalendarId: number;
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
  calendars: Calendar[];
  primaryCalendarId: number;
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

export async function removeCalendar(calendarId: number): Promise<{
  calendars: Calendar[];
  primaryCalendarId: number;
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
