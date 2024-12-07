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
var assistantCollection_exports = {};
__export(assistantCollection_exports, {
  findAssistantById: () => findAssistantById,
  viewGPTs: () => viewGPTs
});
module.exports = __toCommonJS(assistantCollection_exports);
var import_mongodb = require("mongodb");
var import_connection = require("../../connection.js");
let assistantCollection;
const initializeCollection = () => {
  assistantCollection = (0, import_connection.getDb)().collection("gpts");
};
const viewGPTs = async () => {
  if (!assistantCollection) initializeCollection();
  try {
    const result = await assistantCollection.find({}).toArray();
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching Assistants from database: " + error.message
    );
  }
};
const findAssistantById = async (gptId) => {
  if (!assistantCollection) initializeCollection();
  try {
    const result = await assistantCollection.findOne({
      _id: new import_mongodb.ObjectId(gptId)
    });
    return result;
  } catch (error) {
    throw new Error(
      "Error finding Assistant from database: " + error.message
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findAssistantById,
  viewGPTs
});