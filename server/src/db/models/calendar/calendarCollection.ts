import { InsertOneResult, DeleteResult } from "mongodb";
import { environment } from "../../..";
import { Calendar, CalendarDocument } from "@polylink/shared/types";
import { Collection } from "mongodb";
import { getDb } from "../../connection";

let scheduleCollection: Collection<CalendarDocument>;

const initializeCollection = (): Collection<CalendarDocument> => {
  return getDb().collection("calendar");
};

// Create a new calendar with the given sections
export const createSchedule = async (
  schedule: Calendar
): Promise<InsertOneResult<CalendarDocument>> => {
  if (!scheduleCollection) {
    scheduleCollection = initializeCollection();
  }
  try {
    const result = await scheduleCollection.insertOne(
      schedule as CalendarDocument
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
export const getScheduleById = async (
  userId: string,
  scheduleId: string
): Promise<CalendarDocument | null> => {
  if (!scheduleCollection) {
    scheduleCollection = initializeCollection();
  }

  try {
    const result = await scheduleCollection.findOne(
      { id: scheduleId, userId },
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
export const deleteSchedule = async (
  userId: string,
  scheduleId: string
): Promise<DeleteResult> => {
  if (!scheduleCollection) {
    scheduleCollection = initializeCollection();
  }
  if (environment === "dev") {
    console.log("REMOVING SCHEDULE", scheduleId);
  }

  try {
    const result = await scheduleCollection.deleteOne({
      id: scheduleId,
      userId,
    });
    if (result.deletedCount === 0) {
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

/*
    userId: string;
    calendars: string[];
    primaryCalendarId: string;
};
*/
