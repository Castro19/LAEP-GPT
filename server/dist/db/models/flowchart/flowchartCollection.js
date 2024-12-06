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
var flowchartCollection_exports = {};
__export(flowchartCollection_exports, {
  createFlowchart: () => createFlowchart,
  deleteFlowchart: () => deleteFlowchart,
  fetchAllFlowcharts: () => fetchAllFlowcharts,
  fetchFlowchart: () => fetchFlowchart,
  updateAllOtherFlowcharts: () => updateAllOtherFlowcharts,
  updateFlowchart: () => updateFlowchart
});
module.exports = __toCommonJS(flowchartCollection_exports);
var import_mongodb = require("mongodb");
var import_connection = require("../../connection");
let flowchartCollection;
const initializeCollection = () => {
  flowchartCollection = (0, import_connection.getDb)().collection("flowcharts");
};
const createFlowchart = async (flowchartData, name, primaryOption, userId) => {
  if (!flowchartCollection) initializeCollection();
  try {
    if (!userId || typeof userId !== "string") {
      throw new Error("Valid userId is required");
    }
    const result = await flowchartCollection.insertOne({
      flowchartData,
      name,
      primaryOption,
      userId,
      createdAt: /* @__PURE__ */ new Date(),
      // Adding timestamp for better tracking
      updatedAt: /* @__PURE__ */ new Date()
    });
    return result;
  } catch (error) {
    throw new Error(
      "Error creating flowchart in database: " + error.message
    );
  }
};
const fetchFlowchart = async (flowchartId, userId) => {
  try {
    const result = await flowchartCollection.findOne({
      _id: new import_mongodb.ObjectId(flowchartId),
      userId
    });
    if (!result) {
      throw new Error("Flowchart not found");
    }
    if (result.userId !== userId) {
      throw new Error("Forbidden");
    }
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching flowchart from database: " + error.message
    );
  }
};
const fetchAllFlowcharts = async (userId) => {
  try {
    const result = await flowchartCollection.find({ userId }, { projection: { _id: 1, name: 1, primaryOption: 1 } }).toArray();
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching all flowcharts from database: " + error.message
    );
  }
};
const updateFlowchart = async (flowchartId, flowchartData, name, primaryOption, userId) => {
  try {
    const existingDoc = await flowchartCollection.findOne({
      _id: new import_mongodb.ObjectId(flowchartId),
      userId
    });
    if (!existingDoc) {
      throw new Error("Flowchart not found");
    }
    let result;
    if (flowchartData) {
      result = await flowchartCollection.updateOne(
        { _id: new import_mongodb.ObjectId(flowchartId), userId },
        {
          $set: {
            flowchartData,
            name,
            primaryOption,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }
      );
    } else {
      result = await flowchartCollection.updateOne(
        { _id: new import_mongodb.ObjectId(flowchartId), userId },
        {
          $set: {
            name,
            primaryOption,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }
      );
    }
    if (!result.matchedCount) {
      throw new Error("Flowchart not found");
    }
    if (!result.modifiedCount) {
      throw new Error(
        "No changes detected. The data you're trying to save is identical to what's already stored."
      );
    }
    return result;
  } catch (error) {
    throw new Error(
      "Error updating flowchart in database: " + error.message
    );
  }
};
const deleteFlowchart = async (flowchartId, userId) => {
  try {
    const existingDoc = await flowchartCollection.findOne({
      _id: new import_mongodb.ObjectId(flowchartId),
      userId
    });
    if (existingDoc?.userId !== userId) {
      throw new Error("Forbidden");
    }
    const result = await flowchartCollection.deleteOne({
      _id: new import_mongodb.ObjectId(flowchartId),
      userId
    });
    if (!result.deletedCount) {
      throw new Error("Flowchart not found");
    }
    return result;
  } catch (error) {
    throw new Error(
      "Error deleting flowchart from database: " + error.message
    );
  }
};
const updateAllOtherFlowcharts = async (flowchartId, userId) => {
  try {
    const result = await flowchartCollection.bulkWrite([
      {
        // Set the specified flowchart to primary
        updateOne: {
          filter: { _id: new import_mongodb.ObjectId(flowchartId), userId },
          update: { $set: { primaryOption: true } }
        }
      },
      {
        // Set all other flowcharts to not primary
        updateMany: {
          filter: { userId, _id: { $ne: new import_mongodb.ObjectId(flowchartId) } },
          update: { $set: { primaryOption: false } }
        }
      }
    ]);
    return result;
  } catch (error) {
    throw new Error(
      `Error updating flowchart primary options: ${error.message}`
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createFlowchart,
  deleteFlowchart,
  fetchAllFlowcharts,
  fetchFlowchart,
  updateAllOtherFlowcharts,
  updateFlowchart
});
