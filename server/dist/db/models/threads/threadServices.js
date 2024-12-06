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
var threadServices_exports = {};
__export(threadServices_exports, {
  addThreadToDB: () => addThreadToDB,
  deleteThread: () => deleteThread,
  fetchIds: () => fetchIds
});
module.exports = __toCommonJS(threadServices_exports);
var ThreadModel = __toESM(require("./threadCollection"));
const addThreadToDB = async (chatId, threadId, vectorStoreId) => {
  try {
    const result = await ThreadModel.createThread(
      chatId,
      threadId,
      vectorStoreId
    );
    return {
      message: "Thread created successfully",
      threadId: result.insertedId.toString()
      // Ensuring the ID is a string if needed
    };
  } catch (error) {
    console.error("Service error: ", error.message);
    throw new Error("Service error: " + error.message);
  }
};
const fetchIds = async (chatId) => {
  try {
    const ids = await ThreadModel.getIds(chatId);
    if (!ids) return null;
    return { threadId: ids.threadId, vectorStoreId: ids.vectorStoreId };
  } catch (error) {
    console.error("No thread found: ", error.message);
    return null;
  }
};
const deleteThread = async (threadId) => {
  try {
    await ThreadModel.deleteThreadByID(threadId);
  } catch (error) {
    console.error("Error fetching thread ID: ", error.message);
    return null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addThreadToDB,
  deleteThread,
  fetchIds
});
