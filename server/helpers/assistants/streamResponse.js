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
    if (runningStreams[userMessageId].canceled) {
      res.status(200).send("");
      delete runningStreams[userMessageId];
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
        runningStreams[userMessageId].threadId = threadId;
        runningStreams[userMessageId].runId = runId;

        // Check if canceled
        if (runningStreams[userMessageId].canceled) {
          try {
            await openai.beta.threads.runs.cancel(threadId, runId);
            res.status(200).send("Run cancelled");
            delete runningStreams[userMessageId];
            return;
          } catch (error) {
            console.error("Error cancelling run:", error);
            res.status(500).send("Error cancelling run");
            return;
          }
        }
      }

      if (event.event === "thread.run.completed") {
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
      delete runningStreams[userMessageId];
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

export async function runAssistantAndCollectResponse(threadId, assistantId) {
  const run = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  let assistantResponse = "";

  run.on("textDelta", (textDelta) => {
    assistantResponse += textDelta.value;
  });

  await new Promise((resolve, reject) => {
    run.on("end", resolve);
    run.on("errors", reject);
  });

  return assistantResponse;
}
