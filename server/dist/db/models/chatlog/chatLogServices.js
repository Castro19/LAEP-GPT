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
var import__ = require("../../../index");
var import_threadServices = require("../threads/threadServices");
const createLog = async (logData) => {
  try {
    const result = await ChatLogModel.addLog(logData);
    if (!result.acknowledged) {
      throw new Error("Failed to create log");
    }
    return;
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
    if (!result.acknowledged) {
      throw new Error("Failed to update log");
    }
    return;
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
const deleteLog = async (logId, userId) => {
  try {
    const ids = await (0, import_threadServices.fetchIds)(logId);
    const { threadId, vectorStoreId } = ids || {};
    if (vectorStoreId) {
      try {
        const vectorStoreFiles = await import__.openai.beta.vectorStores.files.list(vectorStoreId);
        for (const file of vectorStoreFiles.data) {
          try {
            await import__.openai.files.del(file.id);
          } catch (error) {
            console.warn(
              `Failed to delete file ${file.id}:`,
              error.message
            );
          }
        }
        await import__.openai.beta.vectorStores.del(String(vectorStoreId));
      } catch (error) {
        console.warn(
          "Failed to delete vector store:",
          error.message
        );
      }
    }
    if (threadId) {
      try {
        await import__.openai.beta.threads.del(threadId);
      } catch (error) {
        console.warn("Failed to delete thread:", error.message);
      }
    }
    try {
      const result = await ChatLogModel.deleteLogItem(logId, userId);
      if (!result.acknowledged) {
        throw new Error("Failed to delete log");
      }
      return;
    } catch (error) {
      throw new Error("Service error: " + error.message);
    }
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
    if (!result.acknowledged) {
      throw new Error("Failed to update chat message reaction");
    }
    return;
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
const updateLogTitle = async (logId, userId, title) => {
  try {
    const result = await ChatLogModel.updateLogTitle(logId, userId, title);
    if (!result.acknowledged) {
      throw new Error("Failed to update log title");
    }
    return;
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
