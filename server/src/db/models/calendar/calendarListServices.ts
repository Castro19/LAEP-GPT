import { environment } from "../../..";
import * as calendarListModel from "./calendarListCollection";
import * as calendarCollection from "./calendarCollection";
import {
  Calendar,
  CalendarListItem,
  SelectedSection,
} from "@polylink/shared/types";
import { v4 as uuidv4 } from "uuid";

export const getCalendarListByUserId = async (
  userId: string
): Promise<{
  calendars: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  try {
    const result = await calendarListModel.findCalendarListByUserId(userId);
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

export const updateCalendarListItem = async ({
  userId,
  calendarId,
  calendar,
  primaryCalendarId,
  name,
}: {
  userId: string;
  calendarId: string;
  calendar: Calendar;
  primaryCalendarId: string;
  name: string;
}): Promise<{
  calendars: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  const calendarListItem = {
    id: calendarId,
    name: name,
    updatedAt: new Date(),
  };
  try {
    const calendarResult = await calendarListModel.updateCalendarListItem(
      userId,
      calendarListItem,
      primaryCalendarId
    );
    if (!calendarResult) {
      throw new Error("Failed to update calendar");
    }
    const calendars = await calendarListModel.findCalendarListByUserId(userId);
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

export const createOrUpdateCalendar = async (
  userId: string,
  sections: SelectedSection[]
): Promise<{
  calendars: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  try {
    const calendarId = uuidv4();
    const calendar = {
      id: calendarId,
      userId,
      name: "New Calendar",
      createdAt: new Date(),
      updatedAt: new Date(),
      sections,
    };
    const calendarResult = await calendarCollection.createCalendar(calendar);
    if (!calendarResult) {
      throw new Error("Failed to create calendar");
    }
    const calendars = await calendarListModel.findCalendarListByUserId(userId);
    if (calendars && calendars.calendars.length === 0) {
      await calendarListModel.createOrUpdateCalendarList(
        userId,
        {
          id: calendarId,
          name: calendar.name,
          updatedAt: calendar.updatedAt,
        },
        true // primary calendar
      );
    } else {
      await calendarListModel.createOrUpdateCalendarList(
        userId,
        {
          id: calendarId,
          name: calendar.name,
          updatedAt: calendar.updatedAt,
        },
        false // not primary calendar
      );
    }
    const finalCalendars =
      await calendarListModel.findCalendarListByUserId(userId);
    if (!finalCalendars) {
      throw new Error("No calendars found for the user");
    }
    return {
      calendars: finalCalendars.calendars,
      primaryCalendarId: finalCalendars.primaryCalendarId,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const deleteCalendarItem = async (
  userId: string,
  calendarId: string
): Promise<{
  calendars: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  try {
    const result = await calendarCollection.deleteCalendar(userId, calendarId);
    if (!result) {
      throw new Error("Calendar not found in calendar collection");
    }
    const deletedCalendar = await calendarListModel.deleteCalendarListItem(
      userId,
      calendarId
    );
    if (!deletedCalendar) {
      throw new Error("Calendar not found in calendar list");
    }
    const calendars = await calendarListModel.findCalendarListByUserId(userId);
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

export const getCalendarById = async (
  userId: string,
  calendarId: string
): Promise<Calendar> => {
  try {
    const result = await calendarCollection.getCalendarById(userId, calendarId);
    if (!result) {
      throw new Error("Calendar not found");
    }
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
