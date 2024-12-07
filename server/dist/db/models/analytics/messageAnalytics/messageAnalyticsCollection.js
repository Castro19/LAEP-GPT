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
var messageAnalyticsCollection_exports = {};
__export(messageAnalyticsCollection_exports, {
  addMessageAnalytics: () => addMessageAnalytics,
  updateMessageAnalytics: () => updateMessageAnalytics,
  updateMessageAnalyticsReaction: () => updateMessageAnalyticsReaction
});
module.exports = __toCommonJS(messageAnalyticsCollection_exports);
var import_connection = require("../../../connection");
let messageAnalyticsCollection;
const initializeCollection = () => {
  messageAnalyticsCollection = (0, import_connection.getDb)().collection("messageAnalytics");
};
const addMessageAnalytics = async (messageAnalyticsData) => {
  if (!messageAnalyticsCollection) initializeCollection();
  try {
    const result = await messageAnalyticsCollection.insertOne(messageAnalyticsData);
    return result;
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(
      `Error creating message analytics: ${error.message}`
    );
  }
};
const updateMessageAnalytics = async (userMessageId, updateData) => {
  try {
    const result = await messageAnalyticsCollection.updateMany(
      { _id: userMessageId },
      { $set: updateData }
    );
    return result;
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(
      `Error updating message analytics in database: ${error.message}`
    );
  }
};
const updateMessageAnalyticsReaction = async (botMessageId, userReaction) => {
  try {
    const result = await messageAnalyticsCollection.updateOne(
      { botMessageId },
      { $set: { userReaction } }
    );
    return result;
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(
      `Error updating message analytics reaction in database: ${error.message}`
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addMessageAnalytics,
  updateMessageAnalytics,
  updateMessageAnalyticsReaction
});
