import {
  LogData,
  LogListType,
  MessageObjType,
  MongoLogData,
} from "@polylink/shared/types";
import * as ChatLogModel from "./chatLogCollection.js";

// Create
export const createLog = async (logData: LogData) => {
  try {
    const result = await ChatLogModel.addLog(logData);
    return { message: "Log created successfully", logId: result.insertedId };
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

//Read (Fetch ALL logs by userId)
export const getLogsByUser = async (userId: string) => {
  try {
    return await ChatLogModel.fetchLogsByUserId(userId);
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Read (Fetch a specific log by logId)
export const getLogById = async (logId: string, userId: string) => {
  try {
    const log = await ChatLogModel.fetchLogById(logId, userId);
    return log;
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Update
export const updateLog = async (
  logId: string,
  firebaseUserId: string,
  content: MessageObjType[],
  timestamp: string
) => {
  try {
    // Future: Check Permissions of firebaseUserId before updating Log
    const result = await ChatLogModel.updateLogContent(
      logId,
      firebaseUserId,
      content,
      timestamp
    );
    return {
      message: "Log updated successfully",
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Delete
export const deleteLog = async (logId: string, userId: string) => {
  try {
    const result = await ChatLogModel.deleteLogItem(logId, userId);
    return {
      message: "Log Deleted successfully",
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Other Functions

// Update Chat Message Reaction
export const updateChatMessageReaction = async (
  logId: string,
  botMessageId: string,
  userReaction: "like" | "dislike" | null
) => {
  try {
    const result = await ChatLogModel.updateChatMessageReaction(
      logId,
      botMessageId,
      userReaction
    );
    return {
      message: "Chat message reaction updated successfully",
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Update Log Title
export const updateLogTitle = async (
  logId: string,
  userId: string,
  title: string
) => {
  try {
    const result = await ChatLogModel.updateLogTitle(logId, userId, title);
    return result;
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};
