"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var chatLogServices_exports = {};
__export(chatLogServices_exports, {
  createLog: () => createLog,
  deleteLog: () => deleteLog,
  getLogById: () => getLogById,
  getLogsByUser: () => getLogsByUser,
  updateChatMessageReaction: () => updateChatMessageReaction,
  updateLog: () => updateLog,
  updateLogTitle: () => updateLogTitle
});
module.exports = __toCommonJS(chatLogServices_exports);
var ChatLogModel = __toESM(require("./chatLogCollection.js"));
const createLog = async (logData) => {
  try {
    const result = await ChatLogModel.addLog(logData);
    return { message: "Log created successfully", logId: result.insertedId };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
const getLogsByUser = async (userId) => {
  try {
    return await ChatLogModel.fetchLogsByUserId(userId);
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
const getLogById = async (logId, userId) => {
  try {
    const log = await ChatLogModel.fetchLogById(logId, userId);
    return log;
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
const updateLog = async (logId, firebaseUserId, content, timestamp) => {
  try {
    const result = await ChatLogModel.updateLogContent(
      logId,
      firebaseUserId,
      content,
      timestamp
    );
    return {
      message: "Log updated successfully",
      modifiedCount: result.modifiedCount
    };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
const deleteLog = async (logId, userId) => {
  try {
    const result = await ChatLogModel.deleteLogItem(logId, userId);
    return {
      message: "Log Deleted successfully",
      deletedCount: result.deletedCount
    };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
const updateChatMessageReaction = async (logId, botMessageId, userReaction) => {
  try {
    const result = await ChatLogModel.updateChatMessageReaction(
      logId,
      botMessageId,
      userReaction
    );
    return {
      message: "Chat message reaction updated successfully",
      modifiedCount: result.modifiedCount
    };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
const updateLogTitle = async (logId, userId, title) => {
  try {
    const result = await ChatLogModel.updateLogTitle(logId, userId, title);
    return result;
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createLog,
  deleteLog,
  getLogById,
  getLogsByUser,
  updateChatMessageReaction,
  updateLog,
  updateLogTitle
});
