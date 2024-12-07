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
var llm_exports = {};
__export(llm_exports, {
  default: () => llm_default
});
module.exports = __toCommonJS(llm_exports);
var import_dotenv = __toESM(require("dotenv"));
var import_express = __toESM(require("express"));
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var import_multer = __toESM(require("multer"));
var import__ = require("../index");
var import_blobFunctions = require("../helpers/azure/blobFunctions");
var import_asyncMiddleware = __toESM(require("../middlewares/asyncMiddleware"));
var import_singleAgent = __toESM(require("../helpers/assistants/singleAgent"));
var import_multiAgent = __toESM(require("../helpers/assistants/multiAgent"));
import_dotenv.default.config();
const router = import_express.default.Router();
const upload = (0, import_multer.default)({ dest: "temp/" });
const messageRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  max: 25,
  message: "You have exceeded the message limit of 25 messages per hour. Please try again later.",
  headers: true,
  keyGenerator: (req) => req.body.userId || "unknown-user"
});
const MAX_FILE_SIZE_MB = 1;
const runningStreams = {};
router.post(
  "/respond",
  messageRateLimiter,
  upload.single("file"),
  (0, import_asyncMiddleware.default)(async (req, res) => {
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
    }
    const { message, chatId, userId, userMessageId, currentModel } = req.body;
    if (!userId) {
      res.status(401).end("Unauthorized");
      return;
    }
    const model = JSON.parse(currentModel);
    const file = req.file;
    let userFile = null;
    runningStreams[userMessageId] = {
      canceled: false,
      runId: null,
      threadId: null
    };
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (!file.mimetype || !file.mimetype.includes("pdf")) {
        res.status(400).send("Only PDF files are allowed");
        return;
      }
      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        res.status(413).send(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
        return;
      }
      if (model.title !== "Matching Assistant") {
        try {
          userFile = await (0, import_blobFunctions.handleFileUpload)(file);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
    if (model.title === "Professor & Course Advisor") {
      try {
        await (0, import_multiAgent.default)({
          model,
          message,
          res,
          userMessageId,
          runningStreams,
          chatId
        });
      } catch (error) {
        console.error("Error in multi-agent model:", error);
        if (!res.headersSent) {
          res.status(500).send("Failed to process request.");
        } else {
          res.end();
        }
      }
    } else {
      try {
        await (0, import_singleAgent.default)({
          model,
          chatId,
          userFile,
          message,
          res,
          userId,
          userMessageId,
          runningStreams
        });
      } catch (error) {
        console.error("Error in single-agent model:", error);
        if (!res.headersSent) {
          res.status(500).send("Failed to process request.");
        } else {
          res.end();
        }
      }
    }
  })
);
router.post(
  "/cancel",
  (0, import_asyncMiddleware.default)(async (req, res) => {
    const { userMessageId } = req.body;
    const runData = runningStreams[userMessageId];
    if (runData) {
      runData.canceled = true;
      if (runData.runId && runData.threadId) {
        try {
          await import__.openai.beta.threads.runs.cancel(
            runData.threadId,
            runData.runId
          );
          delete runningStreams[userMessageId];
          res.status(200).send("Run(s) cancelled");
        } catch (error) {
          console.error("Error cancelling run(s):", error);
          res.status(500).send("Error cancelling run(s)");
        }
      } else {
        res.status(200).send("Run cancellation requested");
      }
    } else {
      res.status(404).send("Run not found");
    }
  })
);
router.post(
  "/title",
  (0, import_asyncMiddleware.default)(async (req, res) => {
    try {
      const { message } = req.body;
      const contentStr = "Based on the user's message and the model description, please return a 10-30 character title response that best suits the user's message. Important The response should not be larger than 30 chars and should be a title!";
      const chatCompletion = await import__.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: contentStr
          },
          { role: "user", content: message }
        ]
      });
      const title = chatCompletion.choices[0].message.content;
      res.json({ title });
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      res.status(500).json({ error: "Failed to generate response from OpenAI" });
    }
  })
);
var llm_default = router;
