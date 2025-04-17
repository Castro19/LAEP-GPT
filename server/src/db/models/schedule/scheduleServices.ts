import { environment } from "../../..";
import * as scheduleListModel from "./scheduleListCollection";
import * as scheduleCollection from "./scheduleCollection";
import {
  Schedule,
  ScheduleListItem,
  SelectedSection,
  CourseTerm,
} from "@polylink/shared/types";
import { v4 as uuidv4 } from "uuid";

export const getScheduleListByUserId = async (
  userId: string,
  term: CourseTerm
): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
}> => {
  try {
    const result = await scheduleListModel.findScheduleListByUserId(userId);
    if (!result) {
      if (environment === "dev") {
        console.log("No schedules found for the user");
      }
      return {
        schedules: [],
        primaryScheduleId: "",
      };
    }
    return {
      schedules: result.schedules[term],
      primaryScheduleId: result.primaryScheduleId,
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
  primaryScheduleId,
  name,
  term,
}: {
  userId: string;
  scheduleId: string;
  primaryScheduleId: string;
  name: string;
  term: CourseTerm;
}): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
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
      primaryScheduleId,
      term
    );
    if (!scheduleResult) {
      throw new Error("Failed to update schedule");
    }
    const schedules = await scheduleListModel.findScheduleListByUserId(userId);
    if (!schedules) {
      console.error("No schedules found for the user");
      return {
        schedules: [],
        primaryScheduleId: "",
      };
    }
    return {
      schedules: schedules.schedules[term],
      primaryScheduleId: schedules.primaryScheduleId,
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
  sections: SelectedSection[],
  term: CourseTerm
): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
}> => {
  try {
    const scheduleId = uuidv4();
    const scheduleList =
      await scheduleListModel.findScheduleListByUserId(userId);

    // Initialize schedules array for the term if it doesn't exist
    const currentSchedules = scheduleList?.schedules[term] || [];

    const schedule = {
      id: scheduleId,
      userId,
      name: `Schedule ${currentSchedules.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      sections,
      term,
    };
    const scheduleResult = await scheduleCollection.createSchedule(schedule);
    if (!scheduleResult) {
      throw new Error("Failed to create schedule");
    }
    const schedules = await scheduleListModel.findScheduleListByUserId(userId);
    if (schedules) {
      if (currentSchedules.length === 0 || !schedules.primaryScheduleId) {
        await scheduleListModel.createOrUpdateScheduleList(
          userId,
          {
            id: scheduleId,
            name: schedule.name,
            updatedAt: schedule.updatedAt,
          },
          scheduleId, // primary schedule
          term
        );
      } else {
        await scheduleListModel.createOrUpdateScheduleList(
          userId,
          {
            id: scheduleId,
            name: schedule.name,
            updatedAt: schedule.updatedAt,
          },
          schedules.primaryScheduleId, // not primary schedule
          term
        );
      }
    }
    const finalSchedules =
      await scheduleListModel.findScheduleListByUserId(userId);
    if (!finalSchedules) {
      console.error("No schedules found for the user");
      return {
        schedules: [],
        primaryScheduleId: "",
      };
    }
    return {
      schedules: finalSchedules.schedules[term],
      primaryScheduleId: finalSchedules.primaryScheduleId,
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
  scheduleId: string,
  term: CourseTerm
): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
}> => {
  try {
    const scheduleList =
      await scheduleListModel.findScheduleListByUserId(userId);
    if (!scheduleList) {
      throw new Error("No schedules found for the user");
    }

    if (scheduleList.primaryScheduleId === scheduleId) {
      // We will need to update the primary schedule id
      const newPrimaryScheduleId = scheduleList.schedules[term].find(
        (schedule) => schedule.id !== scheduleId
      )?.id;

      await scheduleListModel.updatePrimaryScheduleId(
        userId,
        newPrimaryScheduleId
      );
    }

    const result = await scheduleCollection.deleteSchedule(userId, scheduleId);
    if (!result) {
      throw new Error("Schedule not found in schedule collection");
    }

    const deletedSchedule = await scheduleListModel.deleteScheduleListItem(
      userId,
      scheduleId,
      term
    );
    if (!deletedSchedule) {
      throw new Error("Schedule not found in schedule list");
    }
    const schedules = await scheduleListModel.findScheduleListByUserId(userId);
    if (!schedules) {
      console.error("No schedules found for the user");
      return {
        schedules: [],
        primaryScheduleId: "",
      };
    }
    return {
      schedules: schedules.schedules[term],
      primaryScheduleId: schedules.primaryScheduleId,
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
): Promise<Schedule | null> => {
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
  userId: string,
  _term: CourseTerm
): Promise<Schedule | null> => {
  const scheduleList = await scheduleListModel.findScheduleListByUserId(userId);

  const primaryScheduleId = scheduleList?.primaryScheduleId;
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
