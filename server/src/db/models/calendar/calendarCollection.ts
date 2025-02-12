import { InsertOneResult, DeleteResult } from "mongodb";
import { environment } from "../../..";
import { Calendar, CalendarDocument } from "@polylink/shared/types";
import { Collection } from "mongodb";
import { getDb } from "../../connection";

let calendarCollection: Collection<CalendarDocument>;

const initializeCollection = (): Collection<CalendarDocument> => {
  return getDb().collection("calendar");
};

// Create a new calendar with the given sections
export const createCalendar = async (
  calendar: Calendar
): Promise<InsertOneResult<CalendarDocument>> => {
  if (!calendarCollection) {
    calendarCollection = initializeCollection();
  }
  try {
    const result = await calendarCollection.insertOne(
      calendar as CalendarDocument
    );
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

// Get a calendar by id
export const getCalendarById = async (
  userId: string,
  calendarId: string
): Promise<CalendarDocument | null> => {
  if (!calendarCollection) {
    calendarCollection = initializeCollection();
  }
  console.log("GETTING CALENDAR BY ID", calendarId);
  try {
    const result = await calendarCollection.findOne(
      { id: calendarId, userId },
      { projection: { _id: 0 } }
    );
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

// Delete /calendars/:id
export const deleteCalendar = async (
  userId: string,
  calendarId: string
): Promise<DeleteResult> => {
  if (!calendarCollection) {
    calendarCollection = initializeCollection();
  }
  if (environment === "dev") {
    console.log("REMOVING CALENDAR", calendarId);
  }

  try {
    const result = await calendarCollection.deleteOne({
      id: calendarId,
      userId,
    });
    if (result.deletedCount === 0) {
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
    calendars: string[];
    primaryCalendarId: string;
};
*/
