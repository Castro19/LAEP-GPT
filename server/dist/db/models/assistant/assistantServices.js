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
var assistantServices_exports = {};
__export(assistantServices_exports, {
  fetchAssistants: () => fetchAssistants,
  getAssistantById: () => getAssistantById
});
module.exports = __toCommonJS(assistantServices_exports);
var assistantModel = __toESM(require("./assistantCollection.js"));
const fetchAssistants = async () => {
  try {
    const result = await assistantModel.viewGPTs();
    if (!result) throw new Error("No assistants found");
    const assistantList = result.map((assistant) => ({
      id: assistant._id,
      title: assistant.title,
      desc: assistant.desc,
      urlPhoto: assistant.urlPhoto,
      suggestedQuestions: assistant.suggestedQuestions
    }));
    return assistantList;
  } catch (error) {
    console.error("CONSOLE LOG ERROR: ", error);
    throw new Error("Error fetching assistants: " + error.message);
  }
};
const getAssistantById = async (gptId) => {
  try {
    const result = await assistantModel.findAssistantById(gptId);
    return result;
  } catch (error) {
    throw new Error(
      "Error finding GPT from database: " + error.message
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchAssistants,
  getAssistantById
});
