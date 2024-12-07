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
var assistantFunctions_exports = {};
__export(assistantFunctions_exports, {
  createAssistant: () => createAssistant,
  deleteAssistant: () => deleteAssistant,
  fetchGPTs: () => fetchGPTs
});
module.exports = __toCommonJS(assistantFunctions_exports);
var import__ = require("../../index.js");
var import_connection = require("../../db/connection.js");
async function createAssistant(name, description, prompt) {
  try {
    const assistant = await import__.openai.beta.assistants.create({
      name,
      instructions: prompt,
      model: "gpt-4o-mini",
      // Use the correct model name
      tools: [{ type: "file_search" }]
      // Add tools if necessary, like Code Interpreter
    });
    const assistantData = {
      title: name,
      description,
      prompt,
      assistantId: assistant.id
      // Store the assistant's ID from OpenAI
    };
    const db = (0, import_connection.getDb)();
    await db.collection("gpts").insertOne(assistantData);
    return assistantData;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw new Error("Failed to create assistant");
  }
}
async function deleteAssistant(assistantId) {
  try {
    const response = await import__.openai.beta.assistants.del(assistantId);
    return response;
  } catch (error) {
    console.error("Error deleting assistant:", error);
    throw new Error("Failed to delete assistant");
  }
}
async function fetchGPTs() {
  try {
    const db = (0, import_connection.getDb)();
    const gpts = await db.collection("gpts").find({}).toArray();
    if (!gpts || gpts.length === 0) {
      return [];
    }
    const gptList = gpts.map((gpt) => ({
      id: gpt._id.toString(),
      title: gpt.title,
      urlPhoto: gpt.urlPhoto
    }));
    return gptList;
  } catch (error) {
    console.error("Error fetching GPTs:", error.message);
    throw new Error("Failed to fetch GPTs");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createAssistant,
  deleteAssistant,
  fetchGPTs
});
