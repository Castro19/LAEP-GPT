import { openai } from "../../index.js";
import calculateCost from "../openAI/costFunction.js";
import { updateMessageAnalytics } from "../../db/models/analytics/messageAnalytics/messageAnalyticsServices.js";

export async function runAssistantAndStreamResponse(
  threadId,
  assistantId,
  res,
  userMessageId,
  runningStreams
) {
  try {
    // Check if the request was canceled before starting the stream
    if (runningStreams[userMessageId]?.canceled) {
      res.status(200).send("");
      return;
    }

    const run = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    });

    let headersSent = false;
    let runId = null;

    run.on("event", async (event) => {
      const runData = event.data;

      if (runId === null) {
        runId = runData.id;

        runningStreams[userMessageId].runId = runId;

        // Check if canceled
        if (runningStreams[userMessageId].canceled) {
          try {
            res.status(200).send("Run cancelled");
            return;
          } catch (error) {
            console.error("Error cancelling run:", error);
            res.status(500).send("Error cancelling run");
            return;
          }
        }
      }

      if (event.event === "thread.run.completed") {
        // Remove this run from runningStreams
        delete runningStreams[userMessageId];

        if (runData.usage) {
          const cost = calculateCost(runData.usage, runData.model);
          const tokenAnalytics = {
            modelType: runData.model,
            promptTokens: runData.usage.prompt_tokens,
            completionTokens: runData.usage.completion_tokens,
            totalTokens: runData.usage.total_tokens,
            promptCost: cost.promptCost,
            completionCost: cost.completionCost,
            totalCost: cost.totalCost,
          };
          updateMessageAnalytics(userMessageId, tokenAnalytics).catch((error) =>
            console.error("Failed to update message analytics:", error)
          );
        }
      }
    });

    run.on("start", () => {
      console.log("Starting");
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
      console.error("Stream error:", error);
      // Remove this run from runningStreams
      if (runningStreams[userMessageId]) {
        delete runningStreams[userMessageId];
      }
      try {
        if (!headersSent) {
          res.status(500).send("Failed to process stream.");
        } else {
          res.end();
        }
      } catch (err) {
        console.error("Error handling stream error:", err);
      }
    });
  } catch (error) {
    console.error("Error in runAssistantAndStreamResponse:", error);
    if (!res.headersSent) {
      res.status(500).send("Failed to process assistant response.");
    } else {
      res.end();
    }
  }
}

export async function runAssistantAndCollectResponse(
  threadId,
  assistantId,
  userMessageId,
  runningStreams,
  res
) {
  let runId = null;

  try {
    // Check if the request was canceled before starting the run
    if (
      runningStreams[userMessageId]?.canceled ||
      !runningStreams[userMessageId]
    ) {
      res.status(200).send("Response canceled");
      return;
    }

    const run = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    });

    let assistantResponse = "";

    run.on("event", async (event) => {
      const runData = event.data;

      // Check if canceled
      if (
        runningStreams[userMessageId].canceled ||
        !runningStreams[userMessageId]
      ) {
        res.status(200).send("Response canceled");
        return;
      }

      if (runId === null) {
        runId = runData.id;

        runningStreams[userMessageId].runId = runId;
      }

      if (event.event === "thread.run.completed") {
        // Set the runId to null
        runningStreams[userMessageId].runId = null;
        runningStreams[userMessageId].threadId = null;
        // Handle usage and update analytics if needed
        if (runData.usage) {
          const cost = calculateCost(runData.usage, runData.model);
          const tokenAnalytics = {
            modelType: runData.model,
            promptTokens: runData.usage.prompt_tokens,
            completionTokens: runData.usage.completion_tokens,
            totalTokens: runData.usage.total_tokens,
            promptCost: cost.promptCost,
            completionCost: cost.completionCost,
            totalCost: cost.totalCost,
          };
          updateMessageAnalytics(userMessageId, tokenAnalytics).catch((error) =>
            console.error("Failed to update message analytics:", error)
          );
        }
      }
    });

    run.on("textDelta", (textDelta) => {
      assistantResponse += textDelta.value;
    });

    await new Promise((resolve, reject) => {
      run.on("end", resolve);
      run.on("error", reject);
    });

    return assistantResponse;
  } catch (error) {
    console.error("Error in runAssistantAndCollectResponse:", error);
    // Clean up runningStreams[userMessageId]
    if (runningStreams[userMessageId] && runningStreams[userMessageId].runId) {
      await openai.beta.threads.runs.cancel(
        threadId,
        runningStreams[userMessageId].runId
      );
      delete runningStreams[userMessageId];
    }
    return "";
  }
}
