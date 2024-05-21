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
      content: log.content,
      title: log.title,
      timestamp: log.timestamp,
      urlPhoto: log.urlPhoto,
    }));
  } catch (error) {
    throw new Error("Service error: " + error.message);
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
