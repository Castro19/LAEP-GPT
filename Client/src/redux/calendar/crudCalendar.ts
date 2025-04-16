import { serverUrl } from "@/helpers/getEnvironmentVars";
import {
  Calendar,
  CalendarListItem,
  SelectedSection,
} from "@polylink/shared/types";

// Calendar List
export async function fetchSchedules(): Promise<{
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/schedules`, {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
}

export async function createOrUpdateSchedule(
  sections: SelectedSection[]
): Promise<{
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/schedules`, {
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
    console.error("Error creating or updating schedule:", error);
    throw error;
  }
}

// Update Calendar List Item
export async function updateSchedule(
  schedule: Calendar,
  primaryCalendarId: string,
  name: string
): Promise<{
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/schedules/${schedule.id}`, {
      method: "PUT",
      body: JSON.stringify({ schedule, primaryCalendarId, name }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating schedule list item:", error);
    throw error;
  }
}

// Calendar Item
export async function getScheduleById(scheduleId: string): Promise<Calendar> {
  try {
    const response = await fetch(`${serverUrl}/schedules/${scheduleId}`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log("data", data);
    if (!data.schedule) {
      throw new Error("Schedule not found");
    }
    return data.schedule;
  } catch (error) {
    console.error("Error getting schedule by id:", error);
    throw error;
  }
}

export async function removeSchedule(scheduleId: string): Promise<{
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/schedules/${scheduleId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing schedule:", error);
    throw error;
  }
}
