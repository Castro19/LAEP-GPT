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
var threadFunctions_exports = {};
__export(threadFunctions_exports, {
  addMessageToThread: () => addMessageToThread,
  deleteThread: () => deleteThread,
  initializeOrFetchIds: () => initializeOrFetchIds
});
module.exports = __toCommonJS(threadFunctions_exports);
var import_dotenv = __toESM(require("dotenv"));
var import__ = require("../../index.js");
var import_threadServices = require("../../db/models/threads/threadServices.js");
import_dotenv.default.config();
async function addMessageToThread(threadId, role, message, fileId, modelTitle) {
  let threadMessages;
  try {
    if (fileId !== null) {
      threadMessages = await import__.openai.beta.threads.messages.create(threadId, {
        role,
        content: message,
        attachments: [{ file_id: fileId, tools: [{ type: "file_search" }] }]
      });
    } else if (modelTitle === "Matching Assistant") {
      threadMessages = await import__.openai.beta.threads.messages.create(threadId, {
        role,
        content: message,
        attachments: [
          {
            file_id: "file-V0WgxfnUxHsZpsds2KqgUfkQ",
            tools: [{ type: "file_search" }]
          }
        ]
      });
    } else {
      threadMessages = await import__.openai.beta.threads.messages.create(threadId, {
        role,
        content: message
      });
    }
    return threadMessages;
  } catch (error) {
    console.error(
      `Failed to send message or get response from ${threadId}
Error:`,
      error
    );
  }
}
async function deleteThread(threadId) {
  return await import__.openai.beta.threads.del(threadId);
}
async function initializeOrFetchIds(chatId) {
  const existing = await (0, import_threadServices.fetchIds)(chatId);
  if (existing) {
    return existing;
  }
  const thread = await import__.openai.beta.threads.create();
  const vectorStore = await import__.openai.beta.vectorStores.create({
    name: String(thread.id)
  });
  await (0, import_threadServices.addThreadToDB)(chatId, thread.id, vectorStore.id);
  return {
    threadId: thread.id,
    vectorStoreId: vectorStore.id
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addMessageToThread,
  deleteThread,
  initializeOrFetchIds
});
