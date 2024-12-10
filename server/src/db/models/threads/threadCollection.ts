import { getDb } from "../../connection";
import { Collection, InsertOneResult } from "mongodb";
import { ThreadDocument } from "@polylink/shared/types";

let threadCollection: Collection<ThreadDocument>;

const initializeCollection = (): void => {
  threadCollection = getDb().collection<ThreadDocument>("threads");
};

// Create
export const createThread = async (
  chatId: string,
  threadId: string,
  vectorStoreId: string | null,
  assistantId: string
): Promise<InsertOneResult<ThreadDocument>> => {
  if (!threadCollection) initializeCollection();

  try {
    const newThread = {
      _id: chatId, // TODO: FIX So we add the chatId as a new property and let mongoDB handle the ID ?
      threadId,
      vectorStoreId,
      assistantId,
    };
    const result = await threadCollection.insertOne(newThread);
    return result;
  } catch (error) {
    throw new Error("Error creating a new thread: " + (error as Error).message);
  }
};

// Read
export const getIds = async (
  chatId: string
): Promise<ThreadDocument | null> => {
  if (!threadCollection) initializeCollection();

  try {
    const thread = await threadCollection.findOne({
      _id: chatId,
    });
    if (!thread) return null;
    return {
      _id: thread._id,
      threadId: thread.threadId,
      vectorStoreId: thread.vectorStoreId,
      assistantId: thread.assistantId,
    };
  } catch (error) {
    throw new Error("Error retrieving threadID: " + (error as Error).message);
  }
};

// Delete
export const deleteThreadByID = async (threadId: string): Promise<void> => {
  if (!threadCollection) initializeCollection();
  try {
    // Could be something to look out in the future: Usually threadId --> ChatID should be a one to one relationship but there could sometimes be an error where multiple chatId map to a single threadId
    await threadCollection.deleteOne({ threadId: threadId });
  } catch (error) {
    throw new Error("Error retrieving threadID: " + (error as Error).message);
  }
};
