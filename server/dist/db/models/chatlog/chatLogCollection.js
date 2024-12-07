"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var chatLogCollection_exports = {};
__export(chatLogCollection_exports, {
  addLog: () => addLog,
  deleteLogItem: () => deleteLogItem,
  fetchLogById: () => fetchLogById,
  fetchLogsByUserId: () => fetchLogsByUserId,
  updateChatMessageReaction: () => updateChatMessageReaction,
  updateLogContent: () => updateLogContent,
  updateLogTitle: () => updateLogTitle
});
module.exports = __toCommonJS(chatLogCollection_exports);
var import_connection = require("../../connection.js");
let chatLogCollection;
const initializeCollection = () => {
  chatLogCollection = (0, import_connection.getDb)().collection("chatLogs");
};
const addLog = async (logData) => {
  if (!chatLogCollection) initializeCollection();
  try {
    const result = await chatLogCollection.insertOne(
      logData
    );
    return result;
  } catch (error) {
    throw new Error("Error creating a new Log: " + error.message);
  }
};
const fetchLogsByUserId = async (userId) => {
  if (!chatLogCollection) initializeCollection();
  try {
    const logs = await chatLogCollection.find({ userId }, { projection: { content: 0 } }).toArray();
    return logs.map((log) => ({
      logId: log.logId,
      title: log.title,
      timestamp: log.timestamp
    }));
  } catch (error) {
    throw new Error("Error fetching logs: " + error.message);
  }
};
const fetchLogById = async (logId, userId) => {
  try {
    const log = await chatLogCollection.findOne(
      { logId },
      { projection: { _id: 0, logId: 1, content: 1, userId: 1 } }
    );
    if (!log) {
      throw new Error("Log not found");
    }
    if (log.userId !== userId) {
      throw new Error("User does not have permission to access this log");
    }
    return log;
  } catch (error) {
    throw new Error("Error fetching log: " + error.message);
  }
};
const updateLogContent = async (logId, firebaseUserId, content, timestamp) => {
  try {
    const result = await chatLogCollection.updateOne(
      { logId },
      {
        $set: {
          userId: firebaseUserId,
          content,
          // Ensure content is handled correctly as per your schema
          timestamp
          // This should be a single datetime value
        }
      }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating log: " + error.message);
  }
};
const updateChatMessageReaction = async (logId, botMessageId, userReaction) => {
  const result = await chatLogCollection.updateOne(
    { logId, "content.id": botMessageId },
    // Find the document with matching _id and content.id
    { $set: { "content.$.userReaction": userReaction } }
    // Use the positional operator $ to target the matching element in content array
  );
  return result;
};
const deleteLogItem = async (logId, userId) => {
  try {
    const result = await chatLogCollection.deleteOne({
      logId,
      userId
    });
    return result;
  } catch (error) {
    throw new Error("Error Deleting log: " + error.message);
  }
};
const updateLogTitle = async (logId, userId, title) => {
  try {
    const result = await chatLogCollection.updateOne(
      { logId, userId },
      { $set: { title } }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating log title: " + error.message);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addLog,
  deleteLogItem,
  fetchLogById,
  fetchLogsByUserId,
  updateChatMessageReaction,
  updateLogContent,
  updateLogTitle
});
