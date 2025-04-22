import {
  ChatLogDocument,
  LogData,
  LogListType,
  MessageObjType,
} from "@polylink/shared/types";
import * as ChatLogModel from "./chatLogCollection";
import { client } from "../../../index";
import { fetchIds } from "../threads/threadServices";

// Create
export const createLog = async (logData: ChatLogDocument): Promise<void> => {
  try {
    const result = await ChatLogModel.addLog(logData);
    if (!result.acknowledged) {
      throw new Error("Failed to create log");
    }
    return;
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

//Read (Fetch a limited # of logs by userId)
export const getLogsByPage = async (
  userId: string,
  page: number,
  limit: number
): Promise<LogListType[]> => {
  try {
    return await ChatLogModel.fetchLogsByUserId(userId, page, limit);
  } catch (error) {
    console.error("Service error in getLimitedLogsByUser:", error);
    throw new Error(
      "Service error fetching limited logs: " + (error as Error).message
    );
  }
};

//Read (Fetch ALL logs by userId)
/*
export const getLogsByUser = async (userId: string): Promise<LogListType[]> => {
  try {
    return await ChatLogModel.fetchLogsByUserId(userId);
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};*/

// Read (Fetch a specific log by logId)
export const getLogById = async (
  logId: string,
  userId: string
): Promise<LogData> => {
  try {
    const log = await ChatLogModel.fetchLogById(logId, userId);
    return log;
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Update
export const updateLog = async ({
  logId,
  assistantMongoId,
  userId,
  content,
  timestamp,
  title,
}: {
  logId: string;
  userId: string;
  content: MessageObjType[];
  timestamp: string;
  assistantMongoId?: string;
  title?: string;
}): Promise<void> => {
  try {
    // Future: Check Permissions of firebaseUserId before updating Log
    const result = await ChatLogModel.updateLogContent(
      logId,
      userId,
      content,
      timestamp,
      title,
      assistantMongoId
    );
    if (!result.acknowledged) {
      throw new Error("Failed to update log");
    }
    return;
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

export const updateLogPreviousMessageId = async (
  logId: string,
  previousMessageId: string
): Promise<void> => {
  try {
    const result = await ChatLogModel.updateLogPreviousMessageId(
      logId,
      previousMessageId
    );

    if (!result.acknowledged) {
      throw new Error("Failed to update log previous message id");
    }
    return;
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};
// Delete
export const deleteLog = async (
  logId: string,
  userId: string
): Promise<void> => {
  try {
    // Get IDs first
    const ids = (await fetchIds(logId)) as {
      threadId: string;
    } | null;
    const { threadId } = ids || {};

    // Try to delete thread
    if (threadId) {
      try {
        await client.beta.threads.del(threadId);
      } catch (error) {
        console.warn("Failed to delete thread:", (error as Error).message);
      }
    }

    // Try to delete log from database
    try {
      const result = await ChatLogModel.deleteLogItem(logId, userId);
      if (!result.acknowledged) {
        throw new Error("Failed to delete log");
      }
      return;
    } catch (error) {
      throw new Error("Service error: " + (error as Error).message);
    }
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
): Promise<void> => {
  try {
    const result = await ChatLogModel.updateChatMessageReaction(
      logId,
      botMessageId,
      userReaction
    );
    if (!result.acknowledged) {
      throw new Error("Failed to update chat message reaction");
    }
    return;
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Update Log Title
export const updateLogTitle = async (
  logId: string,
  userId: string,
  title: string
): Promise<void> => {
  try {
    const result = await ChatLogModel.updateLogTitle(logId, userId, title);
    if (!result.acknowledged) {
      throw new Error("Failed to update log title");
    }
    return;
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};
