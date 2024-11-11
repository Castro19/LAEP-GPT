import * as ChatLogModel from "./chatLogCollection.js";

// Create
export const createLog = async (logData) => {
  try {
    const result = await ChatLogModel.addLog(logData);
    return { message: "Log created successfully", logId: result.insertedId };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};

//Read (Fetch ALL logs by userId)
export const getLogsByUser = async (userId) => {
  try {
    const logs = await ChatLogModel.fetchLogsByUserId(userId);
    return logs.map((log) => ({
      id: log._id,
      title: log.title,
      timestamp: log.timestamp,
      urlPhoto: log.urlPhoto,
    }));
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};

// Read (Fetch a specific log by logId)
export const getLogById = async (logId, userId) => {
  try {
    const log = await ChatLogModel.fetchLogById(logId, userId);
    return log;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Error fetching log",
    };
  }
};

// Update
export const updateLog = async (logId, firebaseUserId, content, timestamp) => {
  try {
    // Future: Check Permissions of firebaseUserId before updating Log
    const result = await ChatLogModel.updateLogContent(
      logId,
      firebaseUserId,
      content,
      timestamp
    );
    return {
      message: "Log updated successfully",
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};

// Delete
export const deleteLog = async (logId, userId) => {
  try {
    const result = await ChatLogModel.deleteLogItem(logId, userId);
    return {
      message: "Log Deleted successfully",
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};

// Update Chat Message Reaction
export const updateChatMessageReaction = async (
  logId,
  botMessageId,
  userReaction
) => {
  try {
    const result = await ChatLogModel.updateChatMessageReaction(
      logId,
      botMessageId,
      userReaction
    );
    return {
      message: "Chat message reaction updated successfully",
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
