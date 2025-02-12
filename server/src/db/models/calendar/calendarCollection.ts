import { Calendar, CalendarDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection, UpdateResult } from "mongodb";
import { environment } from "../../..";
let calendarCollection: Collection<CalendarDocument>;

const initializeCollection = (): Collection<CalendarDocument> => {
  return getDb().collection("calendars");
};

/**
 * Finds all selected sections for a given user.
 * @param userId The ID of the user to find selected sections for.
 * @returns The selected sections for the user.
 */
export const findCalendarsByUserId = async (
  userId: string
): Promise<CalendarDocument | null> => {
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

// Delete /calendars/:id
export const deleteCalendar = async (
  userId: string,
  calendarId: number
): Promise<UpdateResult> => {
  if (!calendarCollection) {
    calendarCollection = initializeCollection();
  }
  if (environment === "dev") {
    console.log("REMOVING CALENDAR", calendarId);
  }

  try {
    const result = await calendarCollection.updateOne(
      { userId },
      { $pull: { calendars: { id: calendarId } } }
    );
    if (result.modifiedCount === 0) {
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

/*
    userId: string;
    calendars: Calendar[];
    primaryCalendarId: number;
};
*/

// Create a new calendar with the given sections

export const createOrUpdateCalendar = async (
  userId: string,
  calendar: Calendar
): Promise<UpdateResult<CalendarDocument>> => {
  if (!calendarCollection) {
    calendarCollection = initializeCollection();
  }

  try {
    const updateResult = await calendarCollection.updateOne(
      { userId },
      { $addToSet: { calendars: calendar } },
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
