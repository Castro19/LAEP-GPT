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
var multiAgent_exports = {};
__export(multiAgent_exports, {
  default: () => multiAgent_default
});
module.exports = __toCommonJS(multiAgent_exports);
var import__ = require("../../index.js");
var import_streamResponse = require("./streamResponse.js");
var import_professorRatingServices = require("../../db/models/professorRatings/professorRatingServices.js");
var import_qdrantQuery = require("../qdrant/qdrantQuery.js");
var import_threadFunctions = require("../openAI/threadFunctions.js");
var import_threadFunctions2 = require("../openAI/threadFunctions.js");
var import_assistantServices = require("../../db/models/assistant/assistantServices.js");
async function handleMultiAgentModel({
  model,
  message,
  res,
  userMessageId,
  runningStreams,
  chatId
}) {
  let messageToAdd = message;
  try {
    const helperAssistantId = import__.formatAssistantId;
    const helperThread = await import__.openai.beta.threads.create();
    runningStreams[userMessageId].threadId = helperThread.id;
    if (!helperAssistantId) {
      throw new Error("Helper assistant ID not found");
    }
    await (0, import_threadFunctions.addMessageToThread)(
      helperThread.id,
      "user",
      messageToAdd,
      null,
      model.title
    );
    const helperResponse = await (0, import_streamResponse.runAssistantAndCollectResponse)(
      helperThread.id,
      helperAssistantId,
      userMessageId,
      runningStreams
    );
    await import__.openai.beta.threads.del(helperThread.id);
    const { threadId } = await (0, import_threadFunctions2.initializeOrFetchIds)(chatId);
    const assistantId = (await (0, import_assistantServices.getAssistantById)(model.id))?.id;
    if (!assistantId) {
      throw new Error("Assistant ID not found");
    }
    runningStreams[userMessageId].threadId = threadId;
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
    if (professorArray.length > 0) {
      const professorIds = [];
      try {
        for (const professor of professorArray) {
          const professorId = await (0, import_qdrantQuery.searchProfessors)(professor, 1);
          professorIds.push(professorId);
        }
      } catch (error) {
        console.error("Failed to search professors:", error);
      }
      try {
        const professorRatings = await (0, import_professorRatingServices.getProfessorRatings)(
          professorIds,
          courseArray.length > 0 ? courseArray : void 0
        );
        messageToAdd += `
Professor Ratings: ${JSON.stringify(
          professorRatings
        )}`;
      } catch (error) {
        console.error("Failed to get professors by course IDs:", error);
      }
    } else if (courseArray.length > 0 && professorArray.length === 0) {
      try {
        const professorRatings = await (0, import_professorRatingServices.getProfessorsByCourseIds)(courseArray);
        messageToAdd += `
Course Descriptions: ${JSON.stringify(
          professorRatings
        )}`;
      } catch (error) {
        console.error("Failed to search courses:", error);
      }
    } else {
      messageToAdd += "No professors or courses found. Analyze the message and see if the user needs to specify the teacher's first name and last name and any courses they are interested in. Or if they are asking about a specific question regarding the previous messages. Either way, respond with a message that is helpful to the user.";
    }
    console.log("messageToAdd: ", messageToAdd);
    await (0, import_threadFunctions.addMessageToThread)(
      threadId,
      "user",
      messageToAdd,
      null,
      // no file
      model.title
    );
    await (0, import_streamResponse.runAssistantAndStreamResponse)(
      threadId,
      assistantId,
      res,
      userMessageId,
      runningStreams
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
    if (!res.headersSent) {
      res.end();
    }
  }
}
var multiAgent_default = handleMultiAgentModel;
