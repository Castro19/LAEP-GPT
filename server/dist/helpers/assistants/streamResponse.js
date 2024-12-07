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
var streamResponse_exports = {};
__export(streamResponse_exports, {
  runAssistantAndCollectResponse: () => runAssistantAndCollectResponse,
  runAssistantAndStreamResponse: () => runAssistantAndStreamResponse
});
module.exports = __toCommonJS(streamResponse_exports);
var import__ = require("../../index.js");
var import_costFunction = require("../openAI/costFunction.js");
var import_messageAnalyticsServices = require("../../db/models/analytics/messageAnalytics/messageAnalyticsServices.js");
async function runAssistantAndStreamResponse(threadId, assistantId, res, userMessageId, runningStreams) {
  try {
    if (runningStreams[userMessageId]?.canceled) {
      if (!res.headersSent) {
        res.status(200).end();
      }
      return;
    }
    const run = import__.openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId
    });
    let runId = null;
    run.on("event", async (event) => {
      try {
        const runData = event.data;
        if (runId === null) {
          runId = runData.id;
          runningStreams[userMessageId].runId = runId;
          if (runningStreams[userMessageId]?.canceled) {
            try {
              if (!res.headersSent) {
                res.status(200).end();
              }
              return;
            } catch (error) {
              console.error("Error cancelling run:", error);
              if (!res.headersSent) {
                res.status(500).end("Error cancelling run");
              }
              return;
            }
          }
        }
        if (event.event === "thread.run.completed") {
          delete runningStreams[userMessageId];
          if (runData.usage && runData.model) {
            const cost = (0, import_costFunction.calculateCost)(runData.usage, runData.model);
            const tokenAnalytics = {
              modelType: runData.model,
              promptTokens: runData.usage.prompt_tokens,
              completionTokens: runData.usage.completion_tokens,
              totalTokens: runData.usage.total_tokens,
              promptCost: cost.promptCost,
              completionCost: cost.completionCost,
              totalCost: cost.totalCost
            };
            (0, import_messageAnalyticsServices.updateMessageAnalytics)(
              userMessageId,
              tokenAnalytics
            ).catch(
              (error) => console.error("Failed to update message analytics:", error)
            );
          }
        }
      } catch (error) {
        console.error("Error in event handler:", error);
        if (runningStreams[userMessageId]) {
          delete runningStreams[userMessageId];
        }
        if (!res.headersSent) {
          res.status(500).end("An error occurred.");
        }
      }
    });
    run.on("textDelta", (textDelta) => {
      try {
        res.write(textDelta.value);
      } catch (error) {
        console.error("Error writing text delta:", error);
      }
    });
    run.on("end", () => {
      try {
        res.end();
      } catch (error) {
        console.error("Error ending response:", error);
      }
    });
    run.on("error", (error) => {
      console.error("Run error:", error);
      if (runningStreams[userMessageId]) {
        delete runningStreams[userMessageId];
      }
      if (!res.headersSent) {
        res.status(500).end("Failed to process stream.");
      }
    });
  } catch (error) {
    console.error("Error in runAssistantAndStreamResponse:", error);
    if (!res.headersSent) {
      res.status(500).end("Failed to process assistant response.");
    } else {
      res.end();
    }
  }
}
async function runAssistantAndCollectResponse(threadId, assistantId, userMessageId, runningStreams) {
  let runId = null;
  return new Promise((resolve, reject) => {
    try {
      if (runningStreams[userMessageId]?.canceled || !runningStreams[userMessageId]) {
        if (runningStreams[userMessageId]) {
          delete runningStreams[userMessageId];
        }
        return reject(new Error("Response canceled"));
      }
      const run = import__.openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId
      });
      let assistantResponse = "";
      run.on("event", async (event) => {
        try {
          const runData = event.data;
          if (runId === null) {
            runId = runData.id;
            runningStreams[userMessageId].runId = runId;
          }
          if (runningStreams[userMessageId]?.canceled || !runningStreams[userMessageId]) {
            if (runningStreams[userMessageId]) {
              delete runningStreams[userMessageId];
            }
            return reject(new Error("Response canceled"));
          }
          if (event.event === "thread.run.completed") {
            runningStreams[userMessageId].runId = null;
            runningStreams[userMessageId].threadId = null;
            if (runData.usage && runData.model) {
              const cost = (0, import_costFunction.calculateCost)(runData.usage, runData.model);
              const tokenAnalytics = {
                modelType: runData.model,
                promptTokens: runData.usage.prompt_tokens,
                completionTokens: runData.usage.completion_tokens,
                totalTokens: runData.usage.total_tokens,
                promptCost: cost.promptCost,
                completionCost: cost.completionCost,
                totalCost: cost.totalCost
              };
              (0, import_messageAnalyticsServices.updateMessageAnalytics)(userMessageId, tokenAnalytics).catch(
                (updateError) => console.error(
                  "Failed to update message analytics:",
                  updateError
                )
              );
            }
          }
        } catch (error) {
          console.error("Error in run event handler:", error);
          if (runningStreams[userMessageId]) {
            delete runningStreams[userMessageId];
          }
          reject(error);
        }
      });
      run.on("textDelta", (textDelta) => {
        assistantResponse += textDelta.value;
      });
      run.on("end", () => {
        resolve(assistantResponse);
      });
      run.on("error", (error) => {
        console.error("Run error:", error);
        if (runningStreams[userMessageId]) {
          delete runningStreams[userMessageId];
        }
        reject(error);
      });
    } catch (error) {
      console.error("Error in runAssistantAndCollectResponse:", error);
      if (runningStreams[userMessageId]) {
        delete runningStreams[userMessageId];
      }
      reject(error);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runAssistantAndCollectResponse,
  runAssistantAndStreamResponse
});
