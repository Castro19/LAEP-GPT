import * as ThreadModel from "./threadCollection.js";

// Confirming the structure in threadServices.js after adding a thread
export const addThread = async (chatId, threadId, vectorStoreId) => {
  try {
    const result = await ThreadModel.createThread(
      chatId,
      threadId,
      vectorStoreId
    );
    return {
      message: "Thread created successfully",
      threadId: result.insertedId.toString(), // Ensuring the ID is a string if needed
    };
  } catch (error) {
    console.error("Service error: ", error.message);
    throw new Error("Service error: " + error.message);
  }
};

// Read
export const fetchIds = async (chatId) => {
  try {
    const { threadId, vectorStoreId } = await ThreadModel.getIds(chatId);
    return threadId && vectorStoreId ? { threadId, vectorStoreId } : null;
  } catch (error) {
    console.error("Error fetching thread ID: ", error.message);
    return null;
  }
};

// Delete
export const deleteThread = async (threadId) => {
  try {
    await ThreadModel.deleteThreadByID(threadId);
  } catch (error) {
    console.error("Error fetching thread ID: ", error.message);
    return null;
  }
};
