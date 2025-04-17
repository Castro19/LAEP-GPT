import { serverUrl } from "@/helpers/getEnvironmentVars";
import {
  Schedule,
  ScheduleListItem,
  SelectedSection,
  CourseTerm,
} from "@polylink/shared/types";

// Schedule List
export async function fetchSchedules(term: CourseTerm): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/schedules?term=${term}`, {
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
  sections: SelectedSection[],
  term: CourseTerm
): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/schedules`, {
      method: "POST",
      body: JSON.stringify({ sections, term }),
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

// Update Schedule List Item
export async function updateSchedule(
  schedule: Schedule,
  primaryScheduleId: string,
  name: string,
  term: CourseTerm
): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/schedules/${schedule.id}`, {
      method: "PUT",
      body: JSON.stringify({ schedule, primaryScheduleId, name, term }),
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

// Schedule Item
export async function getScheduleById(scheduleId: string): Promise<Schedule> {
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

export async function removeSchedule(
  scheduleId: string,
  term: CourseTerm
): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
}> {
  try {
    const response = await fetch(
      `${serverUrl}/schedules/${scheduleId}?term=${term}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing schedule:", error);
    throw error;
  }
}
