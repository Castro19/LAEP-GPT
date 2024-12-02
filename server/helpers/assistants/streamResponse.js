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
      if (!res.headersSent) {
        res.status(200).end(); // End the response
      }
      return;
    }

    const run = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    });

    let runId = null;

    run.on("event", async (event) => {
      try {
        const runData = event.data;

        if (runId === null) {
          runId = runData.id;
          runningStreams[userMessageId].runId = runId;

          // Check if canceled
          if (runningStreams[userMessageId]?.canceled) {
            try {
              if (!res.headersSent) {
                res.status(200).end(); // End the response
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
            updateMessageAnalytics(userMessageId, tokenAnalytics).catch(
              (error) =>
                console.error("Failed to update message analytics:", error)
            );
          }
        }
      } catch (error) {
        console.error("Error in event handler:", error);
        // Clean up runningStreams
        if (runningStreams[userMessageId]) {
          delete runningStreams[userMessageId];
        }
        if (!res.headersSent) {
          res.status(500).end("An error occurred.");
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
      console.error("Run error:", error);
      // Remove this run from runningStreams
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

export async function runAssistantAndCollectResponse(
  threadId,
  assistantId,
  userMessageId,
  runningStreams
) {
  let runId = null;

  return new Promise((resolve, reject) => {
    try {
      // Check if the request was canceled before starting the run
      if (
        runningStreams[userMessageId]?.canceled ||
        !runningStreams[userMessageId]
      ) {
        if (runningStreams[userMessageId]) {
          delete runningStreams[userMessageId];
        }
        return reject(new Error("Response canceled"));
      }

      const run = openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId,
      });

      let assistantResponse = "";

      run.on("event", async (event) => {
        try {
          const runData = event.data;

          if (runId === null) {
            runId = runData.id;
            runningStreams[userMessageId].runId = runId;
          }

          // Check if canceled
          if (
            runningStreams[userMessageId]?.canceled ||
            !runningStreams[userMessageId]
          ) {
            // Clean up runningStreams
            if (runningStreams[userMessageId]) {
              delete runningStreams[userMessageId];
            }
            return reject(new Error("Response canceled"));
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
              updateMessageAnalytics(userMessageId, tokenAnalytics).catch(
                (error) =>
                  console.error("Failed to update message analytics:", error)
              );
            }
          }
        } catch (error) {
          console.error("Error in run event handler:", error);
          // Clean up runningStreams
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
        // Clean up runningStreams
        if (runningStreams[userMessageId]) {
          delete runningStreams[userMessageId];
        }
        reject(error);
      });
    } catch (error) {
      console.error("Error in runAssistantAndCollectResponse:", error);
      // Clean up runningStreams
      if (runningStreams[userMessageId]) {
        delete runningStreams[userMessageId];
      }
      reject(error);
    }
  });
}
