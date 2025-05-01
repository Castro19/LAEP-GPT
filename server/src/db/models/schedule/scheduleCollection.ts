import { InsertOneResult, DeleteResult, UpdateResult } from "mongodb";
import { environment } from "../../..";
import { Schedule, ScheduleDocument } from "@polylink/shared/types";
import { Collection } from "mongodb";
import { getDb } from "../../connection";

let scheduleCollection: Collection<ScheduleDocument>;

const initializeCollection = (): Collection<ScheduleDocument> => {
  return getDb().collection("schedule");
};

// Create a new schedule with the given sections
export const createSchedule = async (
  schedule: Schedule
): Promise<InsertOneResult<ScheduleDocument>> => {
  if (!scheduleCollection) {
    scheduleCollection = initializeCollection();
  }
  try {
    const result = await scheduleCollection.insertOne(
      schedule as ScheduleDocument
    );
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

// Get a schedule by id
export const getScheduleById = async (
  userId: string,
  scheduleId: string
): Promise<ScheduleDocument | null> => {
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

// Delete /schedule/:id
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

// Update an existing schedule
export const updateSchedule = async (
  userId: string,
  scheduleId: string,
  schedule: Schedule
): Promise<UpdateResult<ScheduleDocument>> => {
  if (!scheduleCollection) {
    scheduleCollection = initializeCollection();
  }
  try {
    const result = await scheduleCollection.updateOne(
      { id: scheduleId, userId },
      { $set: schedule as ScheduleDocument }
    );
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
