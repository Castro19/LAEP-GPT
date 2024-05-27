import db from "../../connection.js";
const threadCollection = db.collection("threads");

// Create
export const createThread = async (chatId, threadId) => {
  try {
    const newThread = {
      _id: chatId, // Use Firebase ID as MongoDB document ID
      threadId,
    };

    const result = await threadCollection.insertOne(newThread);
    return result;
  } catch (error) {
    throw new Error("Error creating a new thread: " + error.message);
  }
};

// Read
export const getThreadId = async (chatId) => {
  try {
    const document = await threadCollection.findOne({ _id: chatId });

    return document ? document.threadId : null;
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
