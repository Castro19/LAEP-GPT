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
var threadCollection_exports = {};
__export(threadCollection_exports, {
  createThread: () => createThread,
  deleteThreadByID: () => deleteThreadByID,
  getIds: () => getIds
});
module.exports = __toCommonJS(threadCollection_exports);
var import_connection = require("../../connection.js");
let threadCollection;
const initializeCollection = async () => {
  threadCollection = (0, import_connection.getDb)().collection("threads");
};
const createThread = async (chatId, threadId, vectorStoreId) => {
  if (!threadCollection) initializeCollection();
  try {
    const newThread = {
      _id: chatId,
      // TODO: FIX So we add the chatId as a new property and let mongoDB handle the ID ?
      threadId,
      vectorStoreId
    };
    const result = await threadCollection.insertOne(newThread);
    return result;
  } catch (error) {
    throw new Error("Error creating a new thread: " + error.message);
  }
};
const getIds = async (chatId) => {
  if (!threadCollection) initializeCollection();
  try {
    const thread = await threadCollection.findOne({
      _id: chatId
    });
    if (!thread) return null;
    return {
      threadId: thread.threadId,
      vectorStoreId: thread.vectorStoreId
    };
  } catch (error) {
    throw new Error("Error retrieving threadID: " + error.message);
  }
};
const deleteThreadByID = async (threadId) => {
  if (!threadCollection) initializeCollection();
  try {
    await threadCollection.deleteOne({ threadId });
  } catch (error) {
    throw new Error("Error retrieving threadID: " + error.message);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createThread,
  deleteThreadByID,
  getIds
});
