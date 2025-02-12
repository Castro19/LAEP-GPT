import { CalendarListItem, CalendarListDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection, UpdateResult } from "mongodb";
import { environment } from "../../..";

let calendarCollection: Collection<CalendarListDocument>;

const initializeCollection = (): Collection<CalendarListDocument> => {
  return getDb().collection("calendarList");
};

/**
 * Finds all selected sections for a given user.
 * @param userId The ID of the user to find selected sections for.
 * @returns The selected sections for the user.
 */
export const findCalendarListByUserId = async (
  userId: string
): Promise<CalendarListDocument | null> => {
  if (!calendarCollection) {
    calendarCollection = initializeCollection();
  }
  try {
    // Dont return the _id
    const result = await calendarCollection.findOne(
      { userId },
      { projection: { _id: 0 } }
    );
    if (!result) {
      return null;
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
export const createOrUpdateCalendarList = async (
  userId: string,
  calendar: CalendarListItem,
  isPrimary: boolean
): Promise<UpdateResult<CalendarListDocument>> => {
  if (!calendarCollection) {
    calendarCollection = initializeCollection();
  }

  try {
    const updateResult = await calendarCollection.updateOne(
      { userId },
      {
        $addToSet: {
          calendars: {
            id: calendar.id,
            name: calendar.name,
            updatedAt: calendar.updatedAt,
          },
        },
        $set: {
          primaryCalendarId: isPrimary ? calendar.id : undefined,
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

export const deleteCalendarListItem = async (
  userId: string,
  calendarId: string
): Promise<UpdateResult<CalendarListDocument>> => {
  if (!calendarCollection) {
    calendarCollection = initializeCollection();
  }
  try {
    const result = await calendarCollection.updateOne(
      { userId },
      { $pull: { calendars: { id: calendarId } } }
    );
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
