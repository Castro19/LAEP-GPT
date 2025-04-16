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
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  try {
    const result = await calendarListModel.findCalendarListByUserId(userId);
    if (!result) {
      if (environment === "dev") {
        console.log("No schedules found for the user");
      }
      return {
        schedules: [],
        primaryCalendarId: "",
      };
    }
    return {
      schedules: result.calendars,
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
  schedules: CalendarListItem[];
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
      console.error("No schedules found for the user");
      return {
        schedules: [],
        primaryCalendarId: "",
      };
    }
    return {
      schedules: calendars.calendars,
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
  schedules: CalendarListItem[];
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
      console.error("No schedules found for the user");
      return {
        schedules: [],
        primaryCalendarId: "",
      };
    }
    return {
      schedules: finalCalendars.calendars,
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
  scheduleId: string
): Promise<{
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  try {
    const calendarList =
      await calendarListModel.findCalendarListByUserId(userId);
    if (!calendarList) {
      throw new Error("No schedules found for the user");
    }
    if (calendarList.primaryCalendarId === scheduleId) {
      // We will need to update the primary calendar id
      const newPrimaryCalendarId = calendarList.calendars.find(
        (schedule) => schedule.id !== scheduleId
      )?.id;

      await calendarListModel.updateCalendarListPrimaryId(
        userId,
        newPrimaryCalendarId
      );
    }

    const result = await calendarCollection.deleteCalendar(userId, scheduleId);
    if (!result) {
      throw new Error("Schedule not found in calendar collection");
    }

    const deletedCalendar = await calendarListModel.deleteCalendarListItem(
      userId,
      scheduleId
    );
    if (!deletedCalendar) {
      throw new Error("Schedule not found in calendar list");
    }
    const calendars = await calendarListModel.findCalendarListByUserId(userId);
    if (!calendars) {
      console.error("No schedules found for the user");
      return {
        schedules: [],
        primaryCalendarId: "",
      };
    }
    return {
      schedules: calendars.calendars,
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
  scheduleId: string
): Promise<CalendarListItem | null> => {
  try {
    const result = await calendarCollection.getCalendarById(userId, scheduleId);
    if (!result) {
      throw new Error("Schedule not found");
    }
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const fetchPrimarySchedule = async (
  userId: string
): Promise<Calendar | null> => {
  const calendarList = await calendarListModel.findCalendarListByUserId(userId);

  const primaryCalendarId = calendarList?.primaryCalendarId;
  if (primaryCalendarId) {
    const result = await calendarCollection.getCalendarById(
      userId,
      primaryCalendarId
    );
    if (!result) {
      return null;
    }
    return result;
  }
  return null;
};
