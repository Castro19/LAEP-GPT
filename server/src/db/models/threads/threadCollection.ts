import { getDb } from "../../connection.js";
import { Collection, ObjectId } from "mongodb";
import { ThreadDocument } from "types";

let threadCollection: Collection<ThreadDocument>;

const initializeCollection = async () => {
  threadCollection = getDb().collection<ThreadDocument>("threads");
};

// Create
export const createThread = async (
  chatId: string,
  threadId: string,
  vectorStoreId: string
) => {
  if (!threadCollection) initializeCollection();

  try {
    const newThread = {
      _id: chatId as unknown as ObjectId, // TODO: FIX So we add the chatId as a new property and let mongoDB handle the ID ?
      threadId,
      vectorStoreId,
    };

    const result = await threadCollection.insertOne(newThread);
    return result;
  } catch (error) {
    throw new Error("Error creating a new thread: " + (error as Error).message);
  }
};

// Read
export const getIds = async (chatId: string) => {
  if (!threadCollection) initializeCollection();

  try {
    const thread = await threadCollection.findOne({
      _id: chatId as unknown as ObjectId,
    });
    if (!thread) return null;
    return {
      threadId: thread.threadId,
      vectorStoreId: thread.vectorStoreId,
    };
  } catch (error) {
    throw new Error("Error retrieving threadID: " + (error as Error).message);
  }
};

// Delete
export const deleteThreadByID = async (threadId: string) => {
  if (!threadCollection) initializeCollection();
  try {
    // Could be something to look out in the future: Usually threadId --> ChatID should be a one to one relationship but there could sometimes be an error where multiple chatId map to a single threadId
    await threadCollection.deleteOne({ threadId: threadId });
  } catch (error) {
    throw new Error("Error retrieving threadID: " + (error as Error).message);
  }
};
