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
var gptCollection_exports = {};
__export(gptCollection_exports, {
  addGpt: () => addGpt,
  findAsstId: () => findAsstId,
  getGptById: () => getGptById,
  removeGpt: () => removeGpt,
  viewGPTs: () => viewGPTs
});
module.exports = __toCommonJS(gptCollection_exports);
var import_mongodb = require("mongodb");
var import_connection = require("../../connection.js");
let gptCollection;
const initializeCollection = () => {
  gptCollection = (0, import_connection.getDb)().collection("gpts");
};
const addGpt = async (gptData) => {
  if (!gptCollection) initializeCollection();
  try {
    const result = await gptCollection.insertOne(gptData);
    return result;
  } catch (error) {
    throw new Error(
      "Error creating gpt in database: " + error.message
    );
  }
};
const viewGPTs = async () => {
  if (!gptCollection) initializeCollection();
  try {
    const result = await gptCollection.find({}).toArray();
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching GPTs from database: " + error.message
    );
  }
};
const getGptById = async (gptId) => {
  if (!gptCollection) initializeCollection();
  try {
    const result = await gptCollection.findOne({ _id: new import_mongodb.ObjectId(gptId) });
    return result;
  } catch (error) {
    throw new Error(
      "Error finding GPT from database: " + error.message
    );
  }
};
const removeGpt = async (gptId) => {
  if (!gptCollection) initializeCollection();
  try {
    await gptCollection.deleteOne({
      _id: new import_mongodb.ObjectId(gptId)
    });
  } catch (error) {
    throw new Error("Error Deleting GPT: " + error.message);
  }
};
const findAsstId = async (gptId) => {
  if (!gptCollection) initializeCollection();
  try {
    const asstId = await gptCollection.findOne(
      {
        _id: new import_mongodb.ObjectId(gptId)
      },
      {
        projection: {
          assistantId: 1
        }
      }
    );
    if (!asstId) {
      throw new Error("Assistant not found");
    }
    return asstId;
  } catch (error) {
    throw new Error(`Failed to get Assistant: ${error.message}`);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addGpt,
  findAsstId,
  getGptById,
  removeGpt,
  viewGPTs
});
