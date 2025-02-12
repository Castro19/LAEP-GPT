import { environment } from "../../..";
import * as calendarModel from "./calendarCollection";
import { Calendar, SelectedSection } from "@polylink/shared/types";

export const getCalendarsByUserId = async (
  userId: string
): Promise<{
  calendars: Calendar[];
  primaryCalendarId: number;
}> => {
  try {
    const result = await calendarModel.findCalendarsByUserId(userId);
    if (!result) {
      throw new Error("No calendars found for the user");
    }
    return {
      calendars: result.calendars,
      primaryCalendarId: result.primaryCalendarId,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const createOrUpdateCalendar = async (
  userId: string,
  sections: SelectedSection[]
): Promise<{
  calendars: Calendar[];
  primaryCalendarId: number;
}> => {
  try {
    const calendar = {
      id: Math.random(), // Create a unique id (number)
      name: "New Calendar",
      createdAt: new Date(),
      updatedAt: new Date(),
      sections,
    };
    const result = await calendarModel.createOrUpdateCalendar(userId, calendar);
    if (!result) {
      throw new Error("No calendars found for the user");
    }
    const calendars = await calendarModel.findCalendarsByUserId(userId);
    if (calendars?.calendars.length === 1) {
      return {
        calendars: calendars.calendars,
        primaryCalendarId: calendar.id,
      };
    }

    if (!calendars) {
      throw new Error("No calendars found for the user");
    }
    return {
      calendars: calendars.calendars,
      primaryCalendarId: calendars.primaryCalendarId,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const deleteCalendar = async (
  userId: string,
  calendarId: number
): Promise<{
  calendars: Calendar[];
  primaryCalendarId: number;
}> => {
  try {
    const result = await calendarModel.deleteCalendar(userId, calendarId);
    if (!result) {
      throw new Error("Calendar not found");
    }
    const calendars = await calendarModel.findCalendarsByUserId(userId);
    if (!calendars) {
      throw new Error("No calendars found for the user");
    }
    return {
      calendars: calendars.calendars,
      primaryCalendarId: calendars.primaryCalendarId,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
