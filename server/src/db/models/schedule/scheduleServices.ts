import { environment } from "../../..";
import * as scheduleCollection from "./scheduleCollection";
import {
  Schedule,
  CourseTerm,
  ScheduleResponse,
  CustomScheduleEvent,
  ScheduleListItem,
} from "@polylink/shared/types";
import { v4 as uuidv4 } from "uuid";
import { transformClassNumbersToSelectedSections } from "./transformSection";

// Helper function to transform Schedule[] to ScheduleListItem[] with primary first
const transformToScheduleListItems = (
  schedules: Schedule[]
): ScheduleListItem[] => {
  return schedules
    .sort((a, b) => {
      // Primary schedule always comes first
      if (a.isPrimary) return -1;
      if (b.isPrimary) return 1;
      // Then sort by most recent updatedAt
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .map((schedule) => ({
      id: schedule.id,
      name: schedule.name,
      updatedAt: schedule.updatedAt,
    }));
};

export const getScheduleListByUserId = async (
  userId: string,
  term: CourseTerm
): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
}> => {
  try {
    const result = await scheduleCollection.findSchedulesByUserId(userId, term);
    if (!result || result.length === 0) {
      if (environment === "dev") {
        console.log("No schedules found for the user");
      }
      return {
        schedules: [],
        primaryScheduleId: "",
      };
    }

    // Find the primary schedule
    const primarySchedule = result.find((schedule) => schedule.isPrimary);
    const primaryScheduleId = primarySchedule?.id || "";

    return {
      schedules: transformToScheduleListItems(result),
      primaryScheduleId,
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
  classNumbers: number[],
  term: CourseTerm,
  scheduleIdFromClient: string | undefined,
  customEvents?: CustomScheduleEvent[]
): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
  scheduleId: string;
}> => {
  try {
    // Get all schedules for the user in the given term
    const existingSchedules = await scheduleCollection.findSchedulesByUserId(
      userId,
      term
    );
    const hasAnySchedules = existingSchedules.length > 0;

    let scheduleId = scheduleIdFromClient || uuidv4();
    if (scheduleIdFromClient) {
      // Get the existing schedule to preserve its createdAt and name
      const existingSchedule = await scheduleCollection.getScheduleById(
        userId,
        scheduleIdFromClient
      );

      if (!existingSchedule) {
        throw new Error("Schedule not found for update");
      }

      // Update existing schedule with preserved fields
      const schedule = {
        ...existingSchedule,
        updatedAt: new Date(),
        sections: classNumbers,
        customEvents,
      };

      const updateResult = await scheduleCollection.updateSchedule(
        userId,
        scheduleIdFromClient,
        schedule
      );

      if (!updateResult.matchedCount) {
        throw new Error("Schedule not found for update");
      }
    } else {
      // Create new schedule
      const schedule = {
        id: scheduleId,
        userId,
        name: `Schedule ${existingSchedules.length + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: classNumbers,
        term,
        customEvents,
        isPrimary: !hasAnySchedules, // Set as primary if this is the first schedule
      };

      const scheduleResult = await scheduleCollection.createSchedule(schedule);
      if (!scheduleResult) {
        throw new Error("Failed to create schedule");
      }
    }

    // Get updated list of schedules
    const finalSchedules = await scheduleCollection.findSchedulesByUserId(
      userId,
      term
    );
    const primarySchedule = finalSchedules.find(
      (schedule) => schedule.isPrimary
    );
    const primaryScheduleId = primarySchedule?.id || "";

    return {
      schedules: transformToScheduleListItems(finalSchedules),
      primaryScheduleId,
      scheduleId,
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
    const scheduleToDelete = await scheduleCollection.getScheduleById(
      userId,
      scheduleId
    );
    if (!scheduleToDelete) {
      throw new Error("Schedule not found");
    }

    // If this is the primary schedule, we need to find a new primary
    if (scheduleToDelete.isPrimary) {
      const otherSchedules = await scheduleCollection.findSchedulesByUserId(
        userId,
        term
      );
      const newPrimarySchedule = otherSchedules.find(
        (s) => s.id !== scheduleId
      );

      if (newPrimarySchedule) {
        // Update the new primary schedule
        await scheduleCollection.updateSchedule(userId, newPrimarySchedule.id, {
          ...newPrimarySchedule,
          isPrimary: true,
        });
      }
    }

    const result = await scheduleCollection.deleteSchedule(userId, scheduleId);
    if (!result) {
      throw new Error("Failed to delete schedule");
    }

    // Get updated list of schedules
    const finalSchedules = await scheduleCollection.findSchedulesByUserId(
      userId,
      term
    );
    const primarySchedule = finalSchedules.find(
      (schedule) => schedule.isPrimary
    );
    const primaryScheduleId = primarySchedule?.id || "";

    return {
      schedules: transformToScheduleListItems(finalSchedules),
      primaryScheduleId,
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
): Promise<ScheduleResponse | null> => {
  try {
    const result = await scheduleCollection.getScheduleById(userId, scheduleId);
    if (!result) {
      throw new Error("Schedule not found");
    }

    // Transform the schedule to a ScheduleResponse using the comprehensive utility function
    const selectedSections = await transformClassNumbersToSelectedSections(
      userId,
      result.sections,
      result.term
    );

    // Create and return the ScheduleResponse
    return {
      id: result.id,
      name: result.name,
      sections: selectedSections,
      customEvents: result.customEvents,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      term: result.term,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const fetchPrimarySchedule = async (
  userId: string,
  term: CourseTerm
): Promise<Schedule | null> => {
  const schedules = await scheduleCollection.findSchedulesByUserId(
    userId,
    term
  );
  return schedules.find((schedule) => schedule.isPrimary) || null;
};

export const updateScheduleInfo = async ({
  userId,
  scheduleId,
  name,
  term,
  isPrimary,
}: {
  userId: string;
  scheduleId: string;
  name: string;
  term: CourseTerm;
  isPrimary: boolean;
}): Promise<{
  schedules: ScheduleListItem[];
  primaryScheduleId: string;
}> => {
  try {
    // First update the Schedule collection
    const existingSchedule = await scheduleCollection.getScheduleById(
      userId,
      scheduleId
    );
    if (!existingSchedule) {
      throw new Error("Schedule not found");
    }

    // Update the Schedule document with new name
    const updatedSchedule = {
      ...existingSchedule,
      name,
      updatedAt: new Date(),
      isPrimary,
    };

    const scheduleUpdateResult = await scheduleCollection.updateSchedule(
      userId,
      scheduleId,
      updatedSchedule
    );

    if (!scheduleUpdateResult.matchedCount) {
      throw new Error("Failed to update schedule");
    }

    // Get updated list of schedules
    const finalSchedules = await scheduleCollection.findSchedulesByUserId(
      userId,
      term
    );
    const primarySchedule = finalSchedules.find(
      (schedule) => schedule.isPrimary
    );
    const primaryScheduleId = primarySchedule?.id || "";

    return {
      schedules: transformToScheduleListItems(finalSchedules),
      primaryScheduleId,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
