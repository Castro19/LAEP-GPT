import { environment } from "../../..";
import * as scheduleListModel from "./calendarListCollection";
import * as scheduleCollection from "./calendarCollection";
import {
  Calendar,
  CalendarListItem,
  SelectedSection,
} from "@polylink/shared/types";
import { v4 as uuidv4 } from "uuid";

export const getScheduleListByUserId = async (
  userId: string
): Promise<{
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  try {
    const result = await scheduleListModel.findScheduleListByUserId(userId);
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

export const updateScheduleListItem = async ({
  userId,
  scheduleId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  schedule,
  primaryCalendarId,
  name,
}: {
  userId: string;
  scheduleId: string;
  schedule: Calendar;
  primaryCalendarId: string;
  name: string;
}): Promise<{
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  const scheduleListItem = {
    id: scheduleId,
    name: name,
    updatedAt: new Date(),
  };
  try {
    const scheduleResult = await scheduleListModel.updateScheduleListItem(
      userId,
      scheduleListItem,
      primaryCalendarId
    );
    if (!scheduleResult) {
      throw new Error("Failed to update schedule");
    }
    const schedules = await scheduleListModel.findScheduleListByUserId(userId);
    if (!schedules) {
      console.error("No schedules found for the user");
      return {
        schedules: [],
        primaryCalendarId: "",
      };
    }
    return {
      schedules: schedules.calendars,
      primaryCalendarId: schedules.primaryCalendarId,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const createOrUpdateSchedule = async (
  userId: string,
  sections: SelectedSection[]
): Promise<{
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  try {
    const scheduleId = uuidv4();
    const scheduleList =
      await scheduleListModel.findScheduleListByUserId(userId);
    const schedule = {
      id: scheduleId,
      userId,
      name: scheduleList
        ? `Schedule ${scheduleList.calendars.length + 1}`
        : "Schedule 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      sections,
    };
    const scheduleResult = await scheduleCollection.createSchedule(schedule);
    if (!scheduleResult) {
      throw new Error("Failed to create schedule");
    }
    const schedules = await scheduleListModel.findScheduleListByUserId(userId);
    if (schedules) {
      if (schedules.calendars.length === 0 || !schedules.primaryCalendarId) {
        await scheduleListModel.createOrUpdateScheduleList(
          userId,
          {
            id: scheduleId,
            name: schedule.name,
            updatedAt: schedule.updatedAt,
          },
          scheduleId // primary calendar
        );
      } else {
        await scheduleListModel.createOrUpdateScheduleList(
          userId,
          {
            id: scheduleId,
            name: schedule.name,
            updatedAt: schedule.updatedAt,
          },
          schedules.primaryCalendarId // not primary calendar
        );
      }
    }
    const finalSchedules =
      await scheduleListModel.findScheduleListByUserId(userId);
    if (!finalSchedules) {
      console.error("No schedules found for the user");
      return {
        schedules: [],
        primaryCalendarId: "",
      };
    }
    return {
      schedules: finalSchedules.calendars,
      primaryCalendarId: finalSchedules.primaryCalendarId,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const deleteScheduleItem = async (
  userId: string,
  scheduleId: string
): Promise<{
  schedules: CalendarListItem[];
  primaryCalendarId: string;
}> => {
  try {
    const scheduleList =
      await scheduleListModel.findScheduleListByUserId(userId);
    if (!scheduleList) {
      throw new Error("No schedules found for the user");
    }
    if (scheduleList.primaryCalendarId === scheduleId) {
      // We will need to update the primary calendar id
      const newPrimaryCalendarId = scheduleList.calendars.find(
        (schedule) => schedule.id !== scheduleId
      )?.id;

      await scheduleListModel.updatePrimaryCalendarId(
        userId,
        newPrimaryCalendarId
      );
    }

    const result = await scheduleCollection.deleteSchedule(userId, scheduleId);
    if (!result) {
      throw new Error("Schedule not found in calendar collection");
    }

    const deletedSchedule = await scheduleListModel.deleteScheduleListItem(
      userId,
      scheduleId
    );
    if (!deletedSchedule) {
      throw new Error("Schedule not found in calendar list");
    }
    const schedules = await scheduleListModel.findScheduleListByUserId(userId);
    if (!schedules) {
      console.error("No schedules found for the user");
      return {
        schedules: [],
        primaryCalendarId: "",
      };
    }
    return {
      schedules: schedules.calendars,
      primaryCalendarId: schedules.primaryCalendarId,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const getScheduleById = async (
  userId: string,
  scheduleId: string
): Promise<CalendarListItem | null> => {
  try {
    const result = await scheduleCollection.getScheduleById(userId, scheduleId);
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
  const scheduleList = await scheduleListModel.findScheduleListByUserId(userId);

  const primaryScheduleId = scheduleList?.primaryCalendarId;
  if (primaryScheduleId) {
    const result = await scheduleCollection.getScheduleById(
      userId,
      primaryScheduleId
    );
    if (!result) {
      return null;
    }
    return result;
  }
  return null;
};
