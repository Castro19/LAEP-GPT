import { ScheduleListItem, ScheduleListDocument } from "@polylink/shared/types";
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
        schedules: [],
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
  primaryScheduleId: string
): Promise<UpdateResult<ScheduleListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }

  try {
    const updateResult = await scheduleListCollection.updateOne(
      { userId },
      {
        $addToSet: {
          schedules: {
            id: schedule.id,
            name: schedule.name,
            updatedAt: schedule.updatedAt,
          },
        },
        $set: {
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
  primaryScheduleId: string
): Promise<UpdateResult<ScheduleListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }
  try {
    const updateResult = await scheduleListCollection.updateOne(
      { userId, "schedules.id": scheduleListItem.id },
      {
        $set: {
          "schedules.$.name": scheduleListItem.name,
          "schedules.$.updatedAt": scheduleListItem.updatedAt,
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
  scheduleId: string
): Promise<UpdateResult<ScheduleListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }
  try {
    const result = await scheduleListCollection.updateOne(
      { userId },
      { $pull: { schedules: { id: scheduleId } } }
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
