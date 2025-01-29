import { openai, courseQueryAssistantId, environment } from "../../index";
import { Response } from "express";
import {
  runAssistantAndStreamResponse,
  runAssistantAndCollectResponse,
} from "./streamResponse";

import {
  getProfessorRatings,
  getProfessorsByCourseIds,
} from "../../db/models/professorRatings/professorRatingServices";
import { searchProfessors } from "../qdrant/qdrantQuery";

import { addMessageToThread } from "../openAI/threadFunctions";
import { initializeOrFetchIds } from "../openAI/threadFunctions";
import { getAssistantById } from "../../db/models/assistant/assistantServices";
import { RunningStreamData } from "@polylink/shared/types";
import { getLiveClasses } from "../../db/models/liveClasses/liveClassServices";

type MultiAgentRequest = {
  model: { id: string; title: string };
  message: string;
  res: Response;
  userMessageId: string;
  runningStreams: RunningStreamData;
  chatId: string;
};

async function professorRatings(
  messageToAdd: string,
  object: {
    professors: null | string[];
    courses: null | string[];
  }
): Promise<string> {
  const { professors, courses } = object;

  let professorArray: string[] = [];
  let courseArray: string[] = [];

  if (professors) {
    professorArray = professors;
  }
  if (courses) {
    courseArray = courses;
  }

  // Modify messageToAdd based on the query results
  if (professorArray.length > 0) {
    // Search through vector database for professors
    const professorIds: string[] = [];
    try {
      for (const professor of professorArray) {
        const professorId = await searchProfessors(professor, 1);
        professorIds.push(professorId);
      }
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to search professors:", error);
      }
    }
    // Query MongoDB for professors & courses
    try {
      const professorRatings = await getProfessorRatings(
        professorIds,
        courseArray.length > 0 ? courseArray : undefined
      );
      messageToAdd += `\nProfessor Ratings: ${JSON.stringify(
        professorRatings
      )}`;
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to get professors by course IDs:", error);
      }
    }
  } else if (courseArray.length > 0 && professorArray.length === 0) {
    // Search through vector database for courses
    try {
      const professorRatings = await getProfessorsByCourseIds(courseArray);
      messageToAdd += `\nCourse Descriptions: ${JSON.stringify(
        professorRatings
      )}`;
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to search courses:", error);
      }
    }
  } else {
    messageToAdd +=
      ".\nNo professors or courses found. Analyze the message and see if the user needs to specify the teacher's first name and last name and any courses they are interested in. Answer the user's question as best as possible.";
  }
  return messageToAdd;
}

async function planSpringSchedule(
  messageToAdd: string,
  object: {
    courses: string[];
    preferences: {
      preferred_time: string;
      preferred_days: string[];
    };
  }
): Promise<string> {
  const { courses } = object;

  // TODO: Implement the logic to plan the spring schedule
  try {
    const liveClasses = await getLiveClasses(courses);
    const liveClassString = JSON.stringify(liveClasses);
    messageToAdd += `\n Options: ${liveClassString}\n`;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to plan spring schedule:", error);
    }
  }
  return messageToAdd;
}

async function handleMultiAgentModel({
  model,
  message,
  res,
  userMessageId,
  runningStreams,
  chatId,
}: MultiAgentRequest): Promise<void> {
  let messageToAdd = message;

  try {
    // First assistant: process the user's message and return JSON object
    const helperAssistantId = courseQueryAssistantId;
    const helperThread = await openai.beta.threads.create();
    runningStreams[userMessageId].threadId = helperThread.id;

    if (!helperAssistantId) {
      throw new Error("Helper assistant ID not found");
    }
    // Add user's message to helper thread
    await addMessageToThread(
      helperThread.id,
      "user",
      messageToAdd,
      null,
      model.title
    );

    // Run the helper assistant and collect response
    const helperResponse = await runAssistantAndCollectResponse(
      helperThread.id,
      helperAssistantId,
      userMessageId,
      runningStreams
    );

    if (environment === "dev") {
      console.log("Helper Response: ", helperResponse);
    }

    // Delete the helper thread
    await openai.beta.threads.del(helperThread.id);
    // Set the main thread ID
    // Create thread and vector store if not already created
    const { threadId } = await initializeOrFetchIds(chatId, null, model.id);
    // Setup assistant
    const assistant = await getAssistantById(model.id);
    if (!assistant) {
      throw new Error("Assistant not found");
    }
    const assistantId = assistant.assistantId;
    if (!assistantId) {
      throw new Error("Assistant ID not found");
    }
    runningStreams[userMessageId].threadId = threadId;
    // Parse the helper assistant's response (assumes it's a JSON string)
    let jsonObject;

    // TO-DO: How to always ensure that the response is a JSON object?
    try {
      jsonObject = JSON.parse(helperResponse);
      if (jsonObject.assistant === "professor_reviews") {
        messageToAdd = await professorRatings(messageToAdd, jsonObject);
      } else if (jsonObject.assistant === "spring") {
        messageToAdd = await planSpringSchedule(messageToAdd, jsonObject);
      } else {
        messageToAdd +=
          "No professors or courses found. Analyze the message and see if the user needs to specify the teacher's first name and last name and any courses they are interested in.";
      }
      if (environment === "dev") {
        console.log("JSON OBJECT: ", jsonObject);
      }
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to parse JSON from helper assistant:", error);
      }
      throw new Error("Failed to parse JSON from helper assistant");
    }

    if (environment === "dev") {
      console.log("messageToAdd: ", messageToAdd);
    }

    // Run the assistant and stream response
    await runAssistantAndStreamResponse(
      threadId,
      assistantId,
      res,
      userMessageId,
      runningStreams
    );

    // Add user's modified message to the main thread
    await addMessageToThread(
      threadId,
      "user",
      messageToAdd,
      null, // no file
      model.title
    );
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
