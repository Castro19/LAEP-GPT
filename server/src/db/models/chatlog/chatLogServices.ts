import {
  ChatLogDocument,
  LogData,
  LogListType,
  MessageObjType,
} from "@polylink/shared/types";
import * as ChatLogModel from "./chatLogCollection.js";
import { openai } from "index.js";
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

//Read (Fetch ALL logs by userId)
export const getLogsByUser = async (userId: string): Promise<LogListType[]> => {
  try {
    return await ChatLogModel.fetchLogsByUserId(userId);
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

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
export const updateLog = async (
  logId: string,
  firebaseUserId: string,
  content: MessageObjType[],
  timestamp: string
): Promise<void> => {
  try {
    // Future: Check Permissions of firebaseUserId before updating Log
    const result = await ChatLogModel.updateLogContent(
      logId,
      firebaseUserId,
      content,
      timestamp
    );
    if (!result.acknowledged) {
      throw new Error("Failed to update log");
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
      vectorStoreId: string;
    } | null;
    const { threadId, vectorStoreId } = ids || {};

    // Try to delete vector store and its files
    if (vectorStoreId) {
      try {
        const vectorStoreFiles =
          await openai.beta.vectorStores.files.list(vectorStoreId);
        for (const file of vectorStoreFiles.data) {
          try {
            await openai.files.del(file.id);
          } catch (error) {
            console.warn(
              `Failed to delete file ${file.id}:`,
              (error as Error).message
            );
          }
        }
        await openai.beta.vectorStores.del(String(vectorStoreId));
      } catch (error) {
        console.warn(
          "Failed to delete vector store:",
          (error as Error).message
        );
      }
    }

    // Try to delete thread
    if (threadId) {
      try {
        await openai.beta.threads.del(threadId);
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
