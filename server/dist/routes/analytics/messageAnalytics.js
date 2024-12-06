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
var messageAnalytics_exports = {};
__export(messageAnalytics_exports, {
  default: () => messageAnalytics_default
});
module.exports = __toCommonJS(messageAnalytics_exports);
var import_express = __toESM(require("express"));
var import_messageAnalyticsServices = require("../../db/models/analytics/messageAnalytics/messageAnalyticsServices");
const router = import_express.default.Router();
router.get("/test", async (req, res) => {
  res.status(200).send("Message analytics route");
});
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).send("No user found in request");
    }
    const userData = req.body;
    const messageAnalyticsData = {
      _id: userData.userMessageId,
      userId,
      ...userData
    };
    await (0, import_messageAnalyticsServices.createMessageAnalytics)(
      messageAnalyticsData
    );
    res.status(200).send("Message created successfully");
  } catch (error) {
    res.status(500).send("Failed to create message: " + error.message);
  }
});
router.put("/", async (req, res) => {
  try {
    const { userMessageId, userMessage, createdAt, hadError, errorMessage } = req.body;
    if (!userMessageId) {
      return res.status(400).send("userMessageId is required");
    }
    const finishedAt = /* @__PURE__ */ new Date();
    const startTime = new Date(createdAt).getTime();
    const endTime = new Date(finishedAt).getTime();
    const responseTime = (endTime - startTime) / 1e3;
    await (0, import_messageAnalyticsServices.updateMessageAnalytics)(userMessageId, {
      userMessage,
      responseTime,
      finishedAt,
      hadError,
      errorMessage
    });
    res.status(200).send("Message updated successfully");
  } catch (error) {
    res.status(500).send("Failed to update message: " + error.message);
  }
});
router.put("/reaction", async (req, res) => {
  try {
    const { botMessageId, userReaction } = req.body;
    if (!botMessageId) {
      return res.status(400).send("botMessageId is required");
    }
    await (0, import_messageAnalyticsServices.updateMessageAnalyticsReaction)(botMessageId, userReaction);
    res.status(200).send("Message updated successfully");
  } catch (error) {
    res.status(500).send("Failed to update message: " + error.message);
  }
});
var messageAnalytics_default = router;
