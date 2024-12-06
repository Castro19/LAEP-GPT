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
var vectorStoreFunctions_exports = {};
__export(vectorStoreFunctions_exports, {
  setupVectorStoreAndUpdateAssistant: () => setupVectorStoreAndUpdateAssistant,
  setupVectorStoreWithFile: () => setupVectorStoreWithFile
});
module.exports = __toCommonJS(vectorStoreFunctions_exports);
var import__ = require("../../index.js");
async function setupVectorStoreWithFile(threadId, assistantId, userFileId) {
  const vectorStore = await import__.openai.beta.vectorStores.create({
    name: String(threadId)
  });
  const vectorStoreId = vectorStore.id;
  await import__.openai.beta.vectorStores.files.createAndPoll(vectorStoreId, {
    file_id: userFileId
  });
  await import__.openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: { vector_store_ids: [vectorStoreId] }
    },
    tools: [{ type: "file_search" }]
  });
  return vectorStoreId;
}
async function setupVectorStoreAndUpdateAssistant(vectorStoreId, assistantId, userFileId) {
  if (userFileId) {
    await import__.openai.beta.vectorStores.files.createAndPoll(vectorStoreId, {
      file_id: userFileId
    });
  }
  const vectorStoreFiles = await import__.openai.beta.vectorStores.files.list(vectorStoreId);
  if (vectorStoreFiles.data.length > 0) {
    await import__.openai.beta.assistants.update(assistantId, {
      tool_resources: {
        file_search: { vector_store_ids: [vectorStoreId] }
      },
      tools: [{ type: "file_search" }]
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  setupVectorStoreAndUpdateAssistant,
  setupVectorStoreWithFile
});
