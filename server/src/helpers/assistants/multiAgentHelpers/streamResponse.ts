import {
  MessageAnalyticsTokenAnalytics,
  RunningStreamData,
} from "@polylink/shared/types";
import { Response } from "express";
import { environment, openai } from "../../../index";
import { calculateCost } from "../../openAI/costFunction";
import { updateMessageAnalytics } from "../../../db/models/analytics/messageAnalytics/messageAnalyticsServices";
import { AssistantStreamEvent } from "openai/resources/beta/assistants";
import { Run } from "openai/resources/beta/threads/runs/runs";

export async function runAssistantAndStreamResponse(
  threadId: string,
  assistantId: string,
  res: Response,
  streamId: string,
  runningStreams: RunningStreamData
): Promise<void> {
  try {
    // Check if the request was canceled before starting the stream
    if (runningStreams[streamId]?.canceled) {
      if (!res.headersSent) {
        res.status(200).end(); // End the response
      }
      return;
    }

    const run = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    });

    let runId: string | null = null;

    run.on("event", async (event: AssistantStreamEvent) => {
      try {
        const runData = event.data as Run;

        if (runId === null) {
          runId = runData.id;
          runningStreams[streamId].runId = runId;

          // Check if canceled
          if (runningStreams[streamId]?.canceled) {
            try {
              if (!res.headersSent) {
                res.status(200).end(); // End the response
              }
              return;
            } catch (error: unknown) {
              if (environment === "dev") {
                console.error("Error cancelling run:", error);
              }
              if (!res.headersSent) {
                res.status(500).end("Error cancelling run");
              }
              return;
            }
          }
        }

        if (event.event === "thread.run.completed") {
          // Remove this run from runningStreams
          delete runningStreams[streamId];

          if (runData.usage && runData.model) {
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
            updateMessageAnalytics(
              streamId,
              tokenAnalytics as MessageAnalyticsTokenAnalytics
            ).catch((error: unknown) => {
              if (environment === "dev") {
                console.error("Failed to update message analytics:", error);
              }
            });
          }
        }
      } catch (error: unknown) {
        if (environment === "dev") {
          console.error("Error in event handler:", error);
        }
        // Clean up runningStreams
        if (runningStreams[streamId]) {
          delete runningStreams[streamId];
        }
        if (!res.headersSent) {
          res.status(500).end("An error occurred.");
        }
      }
    });

    run.on("textDelta", (textDelta) => {
      try {
        res.write(textDelta.value);
      } catch (error: unknown) {
        if (environment === "dev") {
          console.error("Error writing text delta:", error);
        }
      }
    });

    run.on("end", () => {
      try {
        res.end();
      } catch (error: unknown) {
        if (environment === "dev") {
          console.error("Error ending response:", error);
        }
      }
    });

    run.on("error", (error: unknown) => {
      if (environment === "dev") {
        console.error("Run error:", error);
      }
      // Remove this run from runningStreams
      if (runningStreams[streamId]) {
        delete runningStreams[streamId];
      }
      if (!res.headersSent) {
        res.status(500).end("Failed to process stream.");
      }
    });
  } catch (error: unknown) {
    if (environment === "dev") {
      console.error("Error in runAssistantAndStreamResponse:", error);
    }
    if (!res.headersSent) {
      res.status(500).end("Failed to process assistant response.");
    } else {
      res.end();
    }
  }
}
export async function runAssistantAndCollectResponse(
  threadId: string,
  assistantId: string,
  streamId: string,
  runningStreams: RunningStreamData
): Promise<{ assistantResponse: string; runId: string }> {
  let runId: string | null = null;

  return new Promise<{ assistantResponse: string; runId: string }>(
    (resolve, reject) => {
      try {
        // Check if the request was canceled before starting the run
        if (runningStreams[streamId]?.canceled || !runningStreams[streamId]) {
          if (runningStreams[streamId]) {
            delete runningStreams[streamId];
          }
          return reject(new Error("Response canceled"));
        }

        const run = openai.beta.threads.runs.stream(threadId, {
          assistant_id: assistantId,
        });

        let assistantResponse = "";

        run.on("event", async (event: AssistantStreamEvent) => {
          try {
            const runData = event.data as Run;

            if (runId === null) {
              runId = runData.id;
              runningStreams[streamId].runId = runId;
            }

            // Check if canceled again after receiving event
            if (
              runningStreams[streamId]?.canceled ||
              !runningStreams[streamId]
            ) {
              if (runningStreams[streamId]) {
                delete runningStreams[streamId];
              }
              return reject(new Error("Response canceled"));
            }

            if (event.event === "thread.run.completed") {
              // Cleanup the run and thread from runningStreams
              runningStreams[streamId].runId = null;
              runningStreams[streamId].threadId = null;

              // Handle usage and update analytics if needed
              if (runData.usage && runData.model) {
                const cost = calculateCost(runData.usage, runData.model);
                const tokenAnalytics: MessageAnalyticsTokenAnalytics = {
                  modelType: runData.model,
                  promptTokens: runData.usage.prompt_tokens,
                  completionTokens: runData.usage.completion_tokens,
                  totalTokens: runData.usage.total_tokens,
                  promptCost: cost.promptCost,
                  completionCost: cost.completionCost,
                  totalCost: cost.totalCost,
                };
                updateMessageAnalytics(streamId, tokenAnalytics).catch(
                  (updateError: unknown) => {
                    if (environment === "dev") {
                      console.error(
                        "Failed to update message analytics:",
                        updateError
                      );
                    }
                  }
                );
              }
            }
          } catch (error: unknown) {
            if (environment === "dev") {
              console.error("Error in run event handler:", error);
            }
            if (runningStreams[streamId]) {
              delete runningStreams[streamId];
            }
            reject(error);
          }
        });

        run.on("textDelta", (textDelta) => {
          assistantResponse += textDelta.value;
        });

        run.on("end", () => {
          resolve({
            assistantResponse: assistantResponse,
            runId: runId as string,
          });
        });

        run.on("error", (error: unknown) => {
          if (environment === "dev") {
            console.error("Run error:", error);
          }
          if (runningStreams[streamId]) {
            delete runningStreams[streamId];
          }
          reject(error);
        });
      } catch (error: unknown) {
        if (environment === "dev") {
          console.error("Error in runAssistantAndCollectResponse:", error);
        }
        if (runningStreams[streamId]) {
          delete runningStreams[streamId];
        }
        reject(error);
      }
    }
  );
}
