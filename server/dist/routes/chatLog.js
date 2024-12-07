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
var chatLog_exports = {};
__export(chatLog_exports, {
  default: () => chatLog_default
});
module.exports = __toCommonJS(chatLog_exports);
var import_express = __toESM(require("express"));
var import_chatLogServices = require("../db/models/chatlog/chatLogServices");
const router = import_express.default.Router();
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { logId, title, content, timestamp } = req.body;
    const newLog = {
      logId,
      title,
      timestamp,
      content,
      userId
    };
    await (0, import_chatLogServices.createLog)(newLog);
    res.status(201).json({ message: "Log created successfully" });
  } catch (error) {
    res.status(500).send("Failed to create log: " + error.message);
    console.error("Failed to create log: ", error);
  }
});
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const logs = await (0, import_chatLogServices.getLogsByUser)(userId);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Failed to fetch logs: ", error);
    res.status(500).send("Failed to fetch logs: " + error.message);
  }
});
router.get("/:logId", async (req, res) => {
  const userId = req.user?.uid;
  const logId = req.params.logId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!logId) {
    return res.status(400).json({ message: "Log ID is required" });
  }
  try {
    const log = await (0, import_chatLogServices.getLogById)(logId, userId);
    res.status(200).json(log);
  } catch (error) {
    console.error("Failed to fetch log: ", error);
    res.status(500).send(error.message || "Failed to fetch log");
  }
});
router.put("/", async (req, res) => {
  const { logId, content, timestamp } = req.body;
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!logId) {
    return res.status(400).json({ message: "Log ID is required" });
  }
  try {
    await (0, import_chatLogServices.updateLog)(logId, userId, content, timestamp);
    res.status(200).json({ message: "Log updated successfully" });
  } catch (error) {
    console.error("Failed to update log: ", error);
    res.status(500).json("Failed to update log in database: " + error.message);
  }
});
router.put("/title", async (req, res) => {
  const { logId, title } = req.body;
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!logId) {
    return res.status(400).json({ message: "Log ID is required" });
  }
  try {
    await (0, import_chatLogServices.updateLogTitle)(logId, userId, title);
    const response = {
      message: "Log title updated successfully",
      logId,
      title
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Failed to update log title: ", error);
    res.status(500).json("Failed to update log title: " + error.message);
  }
});
router.delete("/:logId", async (req, res) => {
  const userId = req.user?.uid;
  const { logId } = req.params;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!logId) {
    return res.status(400).json({ message: "Log ID is required" });
  }
  try {
    await (0, import_chatLogServices.deleteLog)(logId, userId);
    res.status(204).json({ message: "Log deleted successfully" });
  } catch (error) {
    console.error("Failed to Delete log: ", error);
    res.status(500).send("Failed to Delete log in database: " + error.message);
  }
});
router.put("/reaction", async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { logId, botMessageId, userReaction } = req.body;
  try {
    if (userReaction && botMessageId) {
      const result = await (0, import_chatLogServices.updateChatMessageReaction)(
        logId,
        botMessageId,
        userReaction
      );
      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Failed to update chat message reaction: ", error);
    res.status(500).json(
      "Failed to update chat message reaction: " + error.message
    );
  }
});
var chatLog_default = router;
