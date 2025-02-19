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
      if (environment === "dev") {
        console.log("No calendars found for the user");
      }
      return {
        calendars: [],
        primaryCalendarId: "",
      };
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const calendarList =
      await calendarListModel.findCalendarListByUserId(userId);
    const calendar = {
      id: calendarId,
      userId,
      name: calendarList
        ? `Schedule ${calendarList.calendars.length + 1}`
        : "Schedule 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      sections,
    };
    const calendarResult = await calendarCollection.createCalendar(calendar);
    if (!calendarResult) {
      throw new Error("Failed to create calendar");
    }
    const calendars = await calendarListModel.findCalendarListByUserId(userId);
    if (calendars) {
      if (calendars.calendars.length === 0 || !calendars.primaryCalendarId) {
        await calendarListModel.createOrUpdateCalendarList(
          userId,
          {
            id: calendarId,
            name: calendar.name,
            updatedAt: calendar.updatedAt,
          },
          calendarId // primary calendar
        );
      } else {
        await calendarListModel.createOrUpdateCalendarList(
          userId,
          {
            id: calendarId,
            name: calendar.name,
            updatedAt: calendar.updatedAt,
          },
          calendars.primaryCalendarId // not primary calendar
        );
      }
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
