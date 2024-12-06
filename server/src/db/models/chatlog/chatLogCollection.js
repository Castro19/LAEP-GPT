import db from "../../connection.js";

const chatLogCollection = db.collection("chatLogs");

// Create
export const addLog = async (logData) => {
  try {
    const result = await chatLogCollection.insertOne(logData);
    return result;
  } catch (error) {
    throw new Error("Error creating a new Log: " + error.message);
  }
};

// Read
export const fetchLogsByUserId = async (userId) => {
  try {
    const logs = await chatLogCollection
      .find({ userId }, { projection: { content: 0 } })
      .toArray();
    return logs;
  } catch (error) {
    throw new Error("Error fetching logs: " + error.message);
  }
};

export const fetchLogById = async (logId, userId) => {
  try {
    const log = await chatLogCollection.findOne(
      { _id: logId },
      { projection: { content: 1, userId: 1 } }
    );

    if (!log) {
      const error = new Error("Log not found");
      error.status = 404;
      throw error;
    }

    if (log.userId !== userId) {
      const error = new Error(
        "User does not have permission to access this log"
      );
      error.status = 403;
      throw error;
    }

    return log;
  } catch (error) {
    // If it's our custom error, pass it up
    if (error.status) {
      throw error;
    }
    // If it's a DB error, wrap it
    const dbError = new Error(`Error fetching log: ${error.message}`);
    dbError.status = 500;
    throw dbError;
  }
};

// Update
export const updateLogContent = async (
  logId,
  firebaseUserId,
  content,
  timestamp
) => {
  try {
    const result = await chatLogCollection.updateOne(
      { _id: logId },
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
    throw new Error("Error updating log: " + error.message);
  }
};

export const updateChatMessageReaction = async (
  logId,
  botMessageId,
  userReaction
) => {
  // Use the positional operator to find the message within the content array
  const result = await chatLogCollection.updateOne(
    { _id: logId, "content.id": botMessageId }, // Find the document with matching _id and content.id
    { $set: { "content.$.userReaction": userReaction } } // Use the positional operator $ to target the matching element in content array
  );

  return result;
};
// Delete
export const deleteLogItem = async (logId) => {
  try {
    const result = await chatLogCollection.deleteOne({ _id: logId });
    return result;
  } catch (error) {
    throw new Error("Error Deleting log: " + error.message);
  }
};

// Update Log Title
export const updateLogTitle = async (logId, userId, title) => {
  try {
    const result = await chatLogCollection.updateOne(
      { _id: logId, userId: userId },
      { $set: { title: title } }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating log title: " + error.message);
  }
};
