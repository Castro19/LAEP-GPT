import { getDb } from "../../connection";
import {
  ChatLogDocument,
  MessageObjType,
  LogListType,
} from "@polylink/shared/types";
import {
  Collection,
  DeleteResult,
  InsertOneResult,
  UpdateResult,
} from "mongodb";

let chatLogCollection: Collection<ChatLogDocument>;

// Function to initialize the collection
const initializeCollection: () => void = () => {
  chatLogCollection = getDb().collection("chatLogs");
};

// Create
export const addLog = async (
  logData: ChatLogDocument
): Promise<InsertOneResult<ChatLogDocument>> => {
  if (!chatLogCollection) initializeCollection();
  try {
    const result = await chatLogCollection.insertOne(
      logData as ChatLogDocument
    );
    return result;
  } catch (error) {
    throw new Error("Error creating a new Log: " + (error as Error).message);
  }
};

// Read
export const fetchLogsByUserId = async (
  userId: string,
  page: number,
  limit: number
): Promise<LogListType[]> => {
  if (!chatLogCollection) initializeCollection();
  try {
    const logs = await chatLogCollection
      .find({ userId }, { projection: { content: 0 } })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    return logs.map((log) => ({
      logId: log.logId,
      title: log.title,
      timestamp: log.timestamp,
    }));
  } catch (error) {
    throw new Error("Error fetching logs: " + (error as Error).message);
  }
};

export const fetchLogById = async (
  logId: string,
  userId: string
): Promise<ChatLogDocument> => {
  if (!chatLogCollection) initializeCollection();
  try {
    const log = await chatLogCollection.findOne(
      { logId: logId },
      {
        projection: {
          _id: 0,
          logId: 1,
          content: 1,
          userId: 1,
          assistantMongoId: 1,
          previousLogId: 1,
        },
      }
    );

    if (!log) {
      throw new Error("Log not found");
    }

    if (log.userId !== userId) {
      throw new Error("User does not have permission to access this log");
    }

    return log;
  } catch (error) {
    throw new Error("Error fetching log: " + (error as Error).message);
  }
};

// Update
export const updateLogContent = async (
  logId: string,
  userId: string,
  content: MessageObjType[],
  timestamp: string,
  title?: string,
  assistantMongoId?: string
): Promise<UpdateResult> => {
  if (!chatLogCollection) initializeCollection();
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateObj: any = {
      userId: userId,
      content: content,
      timestamp: timestamp,
    };

    if (title) updateObj.title = title;
    if (assistantMongoId) updateObj.assistantMongoId = assistantMongoId;

    const result = await chatLogCollection.updateOne(
      { logId: logId },
      { $set: updateObj }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating log: " + (error as Error).message);
  }
};

export const updateChatMessageReaction = async (
  logId: string,
  botMessageId: string,
  userReaction: "like" | "dislike" | null
): Promise<UpdateResult> => {
  if (!chatLogCollection) initializeCollection();
  try {
    // Use the positional operator to find the message within the content array
    const result = await chatLogCollection.updateOne(
      { logId: logId, "content.id": botMessageId }, // Find the document with matching _id and content.id
      { $set: { "content.$.userReaction": userReaction } } // Use the positional operator $ to target the matching element in content array
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error updating chat message reaction: " + (error as Error).message
    );
  }
};

export const updateLogPreviousMessageId = async (
  logId: string,
  previousLogId: string
): Promise<UpdateResult> => {
  if (!chatLogCollection) initializeCollection();
  try {
    const result = await chatLogCollection.updateOne(
      { logId: logId },
      { $set: { previousLogId: previousLogId } }
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error updating log previous message id: " + (error as Error).message
    );
  }
};
// Delete
export const deleteLogItem = async (
  logId: string,
  userId: string
): Promise<DeleteResult> => {
  if (!chatLogCollection) initializeCollection();
  try {
    const result = await chatLogCollection.deleteOne({
      logId: logId,
      userId: userId,
    });
    return result;
  } catch (error) {
    throw new Error("Error Deleting log: " + (error as Error).message);
  }
};

// Update Log Title
export const updateLogTitle = async (
  logId: string,
  userId: string,
  title: string
): Promise<UpdateResult> => {
  if (!chatLogCollection) initializeCollection();
  try {
    const result = await chatLogCollection.updateOne(
      { logId: logId, userId: userId },
      { $set: { title: title } }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating log title: " + (error as Error).message);
  }
};
