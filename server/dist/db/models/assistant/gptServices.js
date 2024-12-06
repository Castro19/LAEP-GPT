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
var gptServices_exports = {};
__export(gptServices_exports, {
  createGpt: () => createGpt,
  deleteGpt: () => deleteGpt,
  fetchGPTs: () => fetchGPTs,
  getGPT: () => getGPT
});
module.exports = __toCommonJS(gptServices_exports);
var gptModel = __toESM(require("./gptCollection.js"));
var import_assistantFunctions = require("../../../helpers/openAI/assistantFunctions.js");
const createGpt = async (gptData, userId) => {
  try {
    const newAssistant = await (0, import_assistantFunctions.createAssistant)(
      gptData.title,
      gptData.desc,
      gptData.instructions
    );
    console.log("NEW ASSISTANT: ", newAssistant);
    const dbAssistant = {
      userId,
      assistantId: newAssistant.id,
      title: gptData.title,
      desc: gptData.desc,
      urlPhoto: gptData.urlPhoto
    };
    const result = await gptModel.addGpt(dbAssistant);
    console.log("GPT Inserted into MongoDB");
    const newGpt = {
      id: result.insertedId,
      title: gptData.title,
      desc: gptData.desc,
      urlPhoto: gptData.urlPhoto
    };
    return newGpt;
  } catch (error) {
    throw new Error("Service error Creating GPT: " + error.message);
  }
};
const fetchGPTs = async () => {
  try {
    const result = await gptModel.viewGPTs();
    const gptList = result.map((gpt) => ({
      id: gpt._id,
      title: gpt.title,
      desc: gpt.desc,
      urlPhoto: gpt.urlPhoto,
      suggestedQuestions: gpt.suggestedQuestions
    }));
    return gptList;
  } catch (error) {
    console.error("CONSOLE LOG ERROR: ", error);
  }
};
const getGPT = async (gptId) => {
  try {
    const result = await gptModel.getGptById(gptId);
    return result;
  } catch (error) {
    console.error("Error finding model: ", error);
  }
};
const deleteGpt = async (gptId) => {
  try {
    const assistantResponse = await gptModel.findAsstId(gptId);
    const assistantId = assistantResponse.assistantId;
    await (0, import_assistantFunctions.deleteAssistant)(assistantId);
    await gptModel.removeGpt(gptId);
    return { message: `GPT ${assistantId} was deleted!` };
  } catch (error) {
    throw new Error("Service error deleting GPT: " + error.message);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createGpt,
  deleteGpt,
  fetchGPTs,
  getGPT
});
