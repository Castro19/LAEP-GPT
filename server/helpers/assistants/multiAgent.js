import { openai } from "../../index.js";
import {
  runAssistantAndStreamResponse,
  runAssistantAndCollectResponse,
} from "./streamResponse.js";

import { getGPT } from "../../db/models/gpt/gptServices.js";
import {
  getProfessorRatings,
  getProfessorsByCourseIds,
} from "../../db/models/professorRatings/professorRatingServices.js";
import { searchProfessors } from "../../helpers/qdrant/qdrantQuery.js";

import { addMessageToThread } from "../../helpers/openAI/threadFunctions.js";
import { initializeOrFetchIds } from "../../helpers/openAI/threadFunctions.js";

async function handleMultiAgentModel({
  model,
  message,
  res,
  userMessageId,
  runningStreams,
  chatId,
}) {
  let messageToAdd = message;

  try {
    // First assistant: process the user's message and return JSON object
    const helperAssistantId = "asst_JnGRXAtFS8vHDw3dUVYAyBBm";
    const helperThread = await openai.beta.threads.create();
    runningStreams[userMessageId].threadId = helperThread.id;

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
    // Delete the helper thread
    await openai.beta.threads.del(helperThread.id);
    // Set the main thread ID
    // Create thread and vector store if not already created
    const { threadId } = await initializeOrFetchIds(chatId);
    // Setup assistant
    const assistantId = (await getGPT(model.id)).assistantId;
    runningStreams[userMessageId].threadId = threadId;
    // Parse the helper assistant's response (assumes it's a JSON string)
    let jsonObject;
    try {
      jsonObject = JSON.parse(helperResponse);
    } catch (error) {
      console.error("Failed to parse JSON from helper assistant:", error);
      throw new Error("Failed to parse JSON from helper assistant");
    }

    const { type, professors, courses } = jsonObject;
    console.log("type: ", type);
    console.log("professors: ", professors);
    console.log("courses: ", courses);

    let professorArray = [];
    let courseArray = [];
    if (professors) {
      professorArray = professors;
    }
    if (courses) {
      courseArray = courses;
    }

    // Modify messageToAdd based on the query results
    if (professorArray.length > 0) {
      // Search through vector database for professors
      let professorIds = [];
      try {
        for (const professor of professorArray) {
          const professorId = await searchProfessors(professor, 1);
          professorIds.push(professorId);
        }
      } catch (error) {
        console.error("Failed to search professors:", error);
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
        console.error("Failed to get professors by course IDs:", error);
      }
    } else if (courseArray.length > 0 && professorArray.length === 0) {
      // Search through vector database for courses
      try {
        const professorRatings = await getProfessorsByCourseIds(courseArray);
        messageToAdd += `\nCourse Descriptions: ${JSON.stringify(
          professorRatings
        )}`;
      } catch (error) {
        console.error("Failed to search courses:", error);
      }
    } else {
      messageToAdd +=
        "No professors or courses found. Analyze the message and see if the user needs to specify the teacher's first name and last name and any courses they are interested in. Or if they are asking about a specific question regarding the previous messages. Either way, respond with a message that is helpful to the user.";
    }

    console.log("messageToAdd: ", messageToAdd);

    // Add user's modified message to the main thread
    await addMessageToThread(
      threadId,
      "user",
      messageToAdd,
      null, // no file
      model.title
    );

    // Run the assistant and stream response
    await runAssistantAndStreamResponse(
      threadId,
      assistantId,
      res,
      userMessageId,
      runningStreams
    );
  } catch (error) {
    if (error.message === "Response canceled") {
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
