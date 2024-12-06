import { LogData } from "types/log/index.js";
import { getDb } from "../../connection.js";
import { MessageObjType } from "types/message/index.js";
import { Collection, ObjectId } from "mongodb";

let chatLogCollection: Collection;

// Function to initialize the collection
const initializeCollection = () => {
  chatLogCollection = getDb().collection("chatLogs");
};

// Create
export const addLog = async (logData: LogData) => {
  if (!chatLogCollection) initializeCollection();
  try {
    const result = await chatLogCollection.insertOne(logData);
    return result;
  } catch (error) {
    throw new Error("Error creating a new Log: " + (error as Error).message);
  }
};

// Read
export const fetchLogsByUserId = async (userId: string) => {
  if (!chatLogCollection) initializeCollection();
  try {
    const logs = await chatLogCollection
      .find({ userId }, { projection: { content: 0 } })
      .toArray();
    return logs;
  } catch (error) {
    throw new Error("Error fetching logs: " + (error as Error).message);
  }
};

export const fetchLogById = async (logId: string, userId: string) => {
  try {
    const log = await chatLogCollection.findOne(
      // { logId: logId },
      { _id: logId as unknown as ObjectId },
      { projection: { content: 1, userId: 1 } }
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
  firebaseUserId: string,
  content: MessageObjType[],
  timestamp: string
) => {
  try {
    const result = await chatLogCollection.updateOne(
      // { logId: logId },
      { _id: logId as unknown as ObjectId },
      {
        $set: {
          userId: firebaseUserId,
          content: content, // Ensure content is handled correctly as per your schema
          timestamp: timestamp, // This should be a single datetime value
        },
      }
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
) => {
  // Use the positional operator to find the message within the content array
  const result = await chatLogCollection.updateOne(
    // { logId: logId, "content.id": botMessageId }, // Find the document with matching _id and content.id
    { _id: logId as unknown as ObjectId, "content.id": botMessageId }, // Find the document with matching _id and content.id
    { $set: { "content.$.userReaction": userReaction } } // Use the positional operator $ to target the matching element in content array
  );

  return result;
};
// Delete
export const deleteLogItem = async (logId: string, userId: string) => {
  try {
    const result = await chatLogCollection.deleteOne({
      // logId: logId,
      _id: logId as unknown as ObjectId,
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
) => {
  try {
    const result = await chatLogCollection.updateOne(
      // { logId: logId, userId: userId },
      { _id: logId as unknown as ObjectId, userId: userId },
      { $set: { title: title } }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating log title: " + (error as Error).message);
  }
};
