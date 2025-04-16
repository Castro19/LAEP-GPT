import { CalendarListItem, CalendarListDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection, UpdateResult } from "mongodb";
import { environment } from "../../..";

let scheduleListCollection: Collection<CalendarListDocument>;

const initializeCollection = (): Collection<CalendarListDocument> => {
  return getDb().collection("calendarList");
};

/**
 * Finds all selected sections for a given user.
 * @param userId The ID of the user to find selected sections for.
 * @returns The selected sections for the user.
 */
export const findScheduleListByUserId = async (
  userId: string
): Promise<CalendarListDocument> => {
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
        calendars: [],
        primaryCalendarId: "",
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

// Create a new calendar with the given sections
export const createOrUpdateScheduleList = async (
  userId: string,
  schedule: CalendarListItem,
  primaryCalendarId: string
): Promise<UpdateResult<CalendarListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }

  try {
    const updateResult = await scheduleListCollection.updateOne(
      { userId },
      {
        $addToSet: {
          calendars: {
            id: schedule.id,
            name: schedule.name,
            updatedAt: schedule.updatedAt,
          },
        },
        $set: {
          primaryCalendarId: primaryCalendarId,
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
  scheduleListItem: CalendarListItem,
  primaryCalendarId: string
): Promise<UpdateResult<CalendarListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }
  try {
    const updateResult = await scheduleListCollection.updateOne(
      { userId, "calendars.id": scheduleListItem.id },
      {
        $set: {
          "calendars.$.name": scheduleListItem.name,
          "calendars.$.updatedAt": scheduleListItem.updatedAt,
          primaryCalendarId: primaryCalendarId,
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
): Promise<UpdateResult<CalendarListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }
  try {
    const result = await scheduleListCollection.updateOne(
      { userId },
      { $pull: { calendars: { id: scheduleId } } }
    );
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const updatePrimaryCalendarId = async (
  userId: string,
  newPrimaryCalendarId?: string
): Promise<UpdateResult<CalendarListDocument>> => {
  if (!scheduleListCollection) {
    scheduleListCollection = initializeCollection();
  }
  try {
    const result = await scheduleListCollection.updateOne(
      { userId },
      { $set: { primaryCalendarId: newPrimaryCalendarId } }
    );
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
