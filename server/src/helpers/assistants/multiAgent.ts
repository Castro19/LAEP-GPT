import { ASST_MAP, environment, openai } from "../../index";
import { Response } from "express";
import {
  runAssistantAndStreamResponse,
  runAssistantAndCollectResponse,
} from "./streamResponse";
import { addMessageToThread } from "../openAI/threadFunctions";
import { initializeOrFetchIds } from "../openAI/threadFunctions";
import { getAssistantById } from "../../db/models/assistant/assistantServices";
import {
  RunningStreamData,
  ScheduleBuilderSection,
  ScheduleBuilderObject,
} from "@polylink/shared/types";
import scheduleBuilder from "./multiAgentHelpers/scheduleBuilder";
import professorRatings from "./multiAgentHelpers/professorRatings";

type MultiAgentRequest = {
  model: { id: string; title: string };
  message: string;
  res: Response;
  userMessageId: string;
  runningStreams: RunningStreamData;
  chatId: string;
  sections?: ScheduleBuilderSection[];
};

export type ProfessorRatingsObject = {
  type: "courses" | "professor" | "both" | "fallback";
  courses?: string[];
  professors?: string[];
  reason?: string;
};

async function handleMultiAgentModel({
  model,
  message,
  res,
  userMessageId,
  runningStreams,
  chatId,
  sections,
}: MultiAgentRequest): Promise<void> {
  let messageToAdd = message;
  try {
    // First assistant: process the user's message and return JSON object
    let helperAssistantId: string | null = null;
    if (model.title === "Schedule Builder") {
      helperAssistantId = ASST_MAP["schedule_builder_query"] as string;
    } else {
      helperAssistantId = ASST_MAP["professor_ratings_query"] as string;
    }
    if (!helperAssistantId) {
      throw new Error("Helper assistant ID not found");
    }
    // Creates from OpenAI API & Stores in DB if not already created
    const { threadId } = await initializeOrFetchIds(
      chatId,
      null,
      helperAssistantId
    );

    // Add threadId to runningStreams (this is to allow the user to cancel the run)
    runningStreams[userMessageId].threadId = threadId;

    // Add user's message to helper thread
    await addMessageToThread(threadId, "user", messageToAdd, null, model.title);

    // Run the helper assistant and collect response
    const { assistantResponse: helperResponse, runId } =
      await runAssistantAndCollectResponse(
        threadId,
        helperAssistantId,
        userMessageId,
        runningStreams
      );

    if (environment === "dev") {
      console.log("Helper Response: ", helperResponse);
    }
    // Setup assistant
    const assistant = await getAssistantById(model.id);
    if (!assistant) {
      throw new Error("Assistant not found");
    }
    const assistantId = assistant?.assistantId;
    if (!assistantId) {
      throw new Error("Assistant ID not found");
    }
    runningStreams[userMessageId].threadId = threadId;
    // Parse the helper assistant's response (assumes it's a JSON string)
    let jsonObject: ScheduleBuilderObject | ProfessorRatingsObject[] | null =
      null;

    try {
      const completedRun = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
      );
      if (completedRun.status !== "completed") {
        throw new Error(
          `Helper run failed with status: ${completedRun.status}`
        );
      }

      if (model.title === "Schedule Builder") {
        if (helperResponse) {
          jsonObject = JSON.parse(helperResponse) as ScheduleBuilderObject;
        }
        if (!jsonObject) {
          throw new Error("JSON object not found");
        }
        if (!sections) {
          throw new Error("Sections not found");
        }
        if (environment === "dev") {
          console.log("Sections: ", sections);
        }
        // Add classNumbers to jsonObject.
        jsonObject.fetchSections.classNumbers = sections.map(
          (section) => section.classNumber
        );
        // Add sectionInfo to jsonObject.
        jsonObject.fetchProfessors.sectionInfo = sections.map((section) => ({
          courseId: section.courseId,
          classNumber: section.classNumber,
          professors: section.professors,
        }));

        messageToAdd = await scheduleBuilder(messageToAdd, jsonObject);
      } else if (model.title === "Professor Ratings") {
        if (helperResponse) {
          jsonObject = JSON.parse(helperResponse) as ProfessorRatingsObject[];
        }
        if (!jsonObject) {
          throw new Error("JSON object not found");
        }
        messageToAdd = await professorRatings(messageToAdd, jsonObject);
      } else {
        if (environment === "dev") {
          console.log("Do other multi agent model here");
        }
      }

      if (environment === "dev") {
        console.log("Message to add: ", messageToAdd);
      }
      // Add user's modified message to the main thread
      await addMessageToThread(
        threadId,
        "assistant",
        messageToAdd,
        null,
        model.title
      );
      if (assistantId) {
        if (environment === "dev") {
          console.log(
            "Running assistant: ",
            model.title,
            "with message: ",
            messageToAdd
          );
          console.log("ASST ID: ", assistantId);
        }
        // Run the assistant and stream response
        await runAssistantAndStreamResponse(
          threadId,
          assistantId,
          res,
          userMessageId,
          runningStreams
        );
      }
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to parse JSON from helper assistant:", error);
      }
      throw new Error("Failed to parse JSON from helper assistant");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Response canceled") {
      if (!res.headersSent) {
        res.status(200).end("Run canceled");
      }
    } else {
      if (!res.headersSent) {
        res.status(500).end("Failed to process request.");
      }
    }
    // Ensure the response is ended
    if (!res.headersSent) {
      res.end();
    }
  }
}

export default handleMultiAgentModel;
