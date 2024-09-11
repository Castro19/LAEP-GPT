import db from "../../connection.js";
const threadCollection = db.collection("threads");

// Create
export const createThread = async (chatId, threadId, vectorStoreId) => {
  try {
    const newThread = {
      _id: chatId, // Use Firebase ID as MongoDB document ID
      threadId: threadId,
      vectorStoreId: vectorStoreId,
    };

    const result = await threadCollection.insertOne(newThread);
    return result;
  } catch (error) {
    throw new Error("Error creating a new thread: " + error.message);
  }
};

// Read
export const getIds = async (chatId) => {
  try {
    const { threadId, vectorStoreId } = await threadCollection.findOne({
      _id: chatId,
    });

    return threadId && vectorStoreId ? { threadId, vectorStoreId } : null;
  } catch (error) {
    throw new Error("Error retrieving threadID: " + error.message);
  }
};

// Delete
export const deleteThreadByID = async (threadId) => {
  try {
    // Could be something to look out in the future: Usually threadId --> ChatID should be a one to one relationship but there could sometimes be an error where multiple chatId map to a single threadId
    await threadCollection.deleteOne({ threadId: threadId });
  } catch (error) {
    throw new Error("Error retrieving threadID: " + error.message);
  }
};
