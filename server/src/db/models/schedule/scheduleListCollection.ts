import {
  ScheduleListItem,
  ScheduleListDocument,
  CourseTerm,
} from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection, UpdateResult } from "mongodb";
import { environment } from "../../..";

let scheduleListCollection: Collection<ScheduleListDocument>;

const initializeCollection = (): Collection<ScheduleListDocument> => {
  return getDb().collection("calendarList");
};

/**
 * Finds all selected sections for a given user.
 * @param userId The ID of the user to find selected sections for.
 * @returns The selected sections for the user.
 */
export const findScheduleListByUserId = async (
  userId: string
): Promise<ScheduleListDocument> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }
  try {
    // Dont return the _id
    const result = await scheduleListCollection.findOne(
      { userId },
      { projection: { _id: 0 } }
    );
    if (!result) {
      return {
        userId,
        schedules: {
          spring2025: [],
          summer2025: [],
        },
        primaryScheduleId: "",
        _id: "",
      };
    }
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

// Create a new schedule with the given sections
export const createOrUpdateScheduleList = async (
  userId: string,
  schedule: ScheduleListItem,
  primaryScheduleId: string,
  term: CourseTerm
): Promise<UpdateResult<ScheduleListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }

  try {
    // Get current document
    const currentDoc = await scheduleListCollection.findOne({ userId });

    // Initialize schedules object with proper type
    let schedules: { [K in CourseTerm]: ScheduleListItem[] } = {
      spring2025: [],
      summer2025: [],
    };

    // If document exists and has valid schedules, use them
    if (currentDoc?.schedules && !Array.isArray(currentDoc.schedules)) {
      schedules = currentDoc.schedules;
    }

    // Add the new schedule
    schedules[term].push({
      id: schedule.id,
      name: schedule.name,
      updatedAt: schedule.updatedAt,
    });

    // Update the document
    const updateResult = await scheduleListCollection.updateOne(
      { userId },
      {
        $set: {
          schedules,
          primaryScheduleId,
        },
      },
      { upsert: true }
    );

    return updateResult;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const updateScheduleListItem = async (
  userId: string,
  scheduleListItem: ScheduleListItem,
  primaryScheduleId: string,
  term: CourseTerm
): Promise<UpdateResult<ScheduleListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }
  try {
    const updateResult = await scheduleListCollection.updateOne(
      { userId, [`schedules.${term}.id`]: scheduleListItem.id },
      {
        $set: {
          [`schedules.${term}.$.name`]: scheduleListItem.name,
          [`schedules.${term}.$.updatedAt`]: scheduleListItem.updatedAt,
          primaryScheduleId: primaryScheduleId,
        },
      }
    );
    return updateResult;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const deleteScheduleListItem = async (
  userId: string,
  scheduleId: string,
  term: CourseTerm
): Promise<UpdateResult<ScheduleListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }
  try {
    const result = await scheduleListCollection.updateOne(
      { userId },
      { $pull: { [`schedules.${term}`]: { id: scheduleId } } }
    );
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const updatePrimaryScheduleId = async (
  userId: string,
  newPrimaryScheduleId?: string
): Promise<UpdateResult<ScheduleListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }
  try {
    const result = await scheduleListCollection.updateOne(
      { userId },
      { $set: { primaryScheduleId: newPrimaryScheduleId } }
    );
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
