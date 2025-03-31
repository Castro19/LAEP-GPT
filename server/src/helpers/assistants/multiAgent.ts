import { environment } from "../../index";
import { Response } from "express";

// Stream Response
import { runAssistantAndStreamResponse } from "./multiAgentHelpers/streamResponse";
import {
  addMessageToThread,
  initializeOrFetchIds,
} from "../openAI/threadFunctions";

// Multi-Assistant Flows
import handleScheduleBuilderFlow from "./scheduleAnalysis/scheduleAnalysisAssistant";

// Multi-Agent general helpers
import {
  fetchMainAssistant,
  handleErrors,
} from "./multiAgentHelpers/generalHelpers";

// Types
import {
  RunningStreamData,
  ScheduleBuilderSection,
} from "@polylink/shared/types";

type MultiAgentRequest = {
  model: { id: string; title: string };
  message: string;
  res: Response;
  streamId: string;
  runningStreams: RunningStreamData;
  logId: string;
  sections?: ScheduleBuilderSection[];
};

/**
 * Main function to process the multi-agent model.
 *
 * Workflow:
 * 1. Delegates to the Schedule Analysis or Professor Ratings flow based on the model title.
 * 2. Retrieves the main assistant's ID.
 * 3. Initializes (or fetches) the thread and adds the updated message.
 * 4. Runs the main assistant and streams the response back to the client.
 */
async function handleMultiAgentModel({
  model,
  message,
  res,
  streamId,
  runningStreams,
  logId,
  sections,
}: MultiAgentRequest): Promise<void> {
  try {
    let messageToAdd: string;

    // Delegate to the appropriate flow based on the model title.
    if (model.title === "Schedule Analysis") {
      messageToAdd = await handleScheduleBuilderFlow(message, sections);
    } else {
      throw new Error("Unsupported model title");
    }

    if (environment === "dev") {
      console.log("Modified message to add:", messageToAdd);
    }

    // Fetch the main assistant's ID.
    const assistantId = await fetchMainAssistant(model.id);
    // Initialize (or fetch) thread IDs.
    const { threadId } = await initializeOrFetchIds(logId, assistantId);

    // Add the updated message to the main thread.
    await addMessageToThread(threadId, "assistant", messageToAdd);

    if (environment === "dev") {
      console.log(
        `Running main assistant (${model.title}) with message:`,
        messageToAdd
      );
    }
    // Run the main assistant and stream the response back to the client.
    await runAssistantAndStreamResponse(
      threadId,
      assistantId,
      res,
      streamId,
      runningStreams
    );
  } catch (error) {
    if (environment === "dev") {
      console.error("Error in handleMultiAgentModel:", error);
    }
    handleErrors(error, res);
  }
}

export default handleMultiAgentModel;
