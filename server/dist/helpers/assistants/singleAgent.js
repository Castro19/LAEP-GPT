"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var singleAgent_exports = {};
__export(singleAgent_exports, {
  default: () => singleAgent_default
});
module.exports = __toCommonJS(singleAgent_exports);
var import_threadFunctions = require("../openAI/threadFunctions.js");
var import_userServices = require("../../db/models/user/userServices.js");
var import_flowchartServices = require("../../db/models/flowchart/flowchartServices.js");
var import_assistantServices = require("../../db/models/assistant/assistantServices.js");
var import_vectorStoreFunctions = require("../openAI/vectorStoreFunctions.js");
var import_threadFunctions2 = require("../openAI/threadFunctions.js");
var import_availabilityFormatter = require("../formatters/availabilityFormatter");
var import_streamResponse = require("./streamResponse");
var import_qdrantQuery = require("../qdrant/qdrantQuery.js");
var import_courseServices = require("../../db/models/courses/courseServices.js");
var import_flowchart = __toESM(require("../flowchart/flowchart.js"));
const matchingAssistant = (user, message) => {
  const availability = (0, import_availabilityFormatter.formatAvailability)(user.availability);
  const interests = user.interests.join(", ");
  return `My availability: ${availability}
My interests: ${interests}
${message}`;
};
const csciClassesAssistant = (user, message) => {
  const year = user.year;
  const interests = user.interests.join(", ");
  return `Year: ${year}
Classes taken: ${user.courses}
Interests: ${interests}
${message}`;
};
const flowchartAssistant = async (user, message) => {
  const flowchart = await (0, import_flowchartServices.fetchFlowchart)(user.flowchartId, user.userId);
  const {
    formattedRequiredCourses,
    techElectivesLeft,
    generalWritingMet,
    uscpMet
  } = await (0, import_flowchart.default)(flowchart.flowchartData.termData, user.catalog);
  const interests = user.interests.join(", ");
  const year = user.year;
  return `Required Courses: ${formattedRequiredCourses}
Tech Electives Left: ${techElectivesLeft}
General Writing Met: ${generalWritingMet}
USCP Met: ${uscpMet}
Year: ${year}
Interests: ${interests}
${message}`;
};
const courseCatalogAssistant = async (user, message) => {
  const courseIds = await (0, import_qdrantQuery.searchCourses)(message, null, 5);
  const courseObjects = await (0, import_courseServices.getCourseInfo)(courseIds);
  const courseDescriptions = JSON.stringify(courseObjects);
  return `Search Results: ${courseDescriptions}
${message}`;
};
const calpolyClubsAssistant = (user, message) => {
  const interests = user.interests.join(", ");
  const major = user.major;
  return `Interests: ${interests}
Major: ${major}
${message}`;
};
async function handleSingleAgentModel({
  model,
  chatId,
  userFile,
  message,
  res,
  userId,
  userMessageId,
  runningStreams
}) {
  let messageToAdd = message;
  const assistant = await (0, import_assistantServices.getAssistantById)(model.id);
  if (!assistant) {
    throw new Error("Assistant not found");
  }
  const assistantId = assistant.assistantId;
  if (!assistantId) {
    throw new Error("Assistant ID not found");
  }
  const { threadId, vectorStoreId } = await (0, import_threadFunctions2.initializeOrFetchIds)(chatId);
  runningStreams[userMessageId].threadId = threadId;
  await (0, import_vectorStoreFunctions.setupVectorStoreAndUpdateAssistant)(
    vectorStoreId,
    assistantId,
    userFile ? userFile.id : null
  );
  const user = await (0, import_userServices.getUserByFirebaseId)(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (model.title === "Matching Assistant") {
    messageToAdd = matchingAssistant(user, message);
  } else if (model.title === "CSCI Classes Assistant") {
    messageToAdd = csciClassesAssistant(user, message);
  } else if (model.title === "Flowchart Assistant") {
    messageToAdd = await flowchartAssistant(user, message);
  } else if (model.title === "Course Catalog") {
    messageToAdd = await courseCatalogAssistant(user, message);
  } else if (model.title === "Calpoly Clubs") {
    messageToAdd = calpolyClubsAssistant(user, message);
  }
  console.log("messageToAdd: ", messageToAdd);
  try {
    await (0, import_threadFunctions.addMessageToThread)(
      threadId,
      "user",
      messageToAdd,
      userFile ? userFile.id : null,
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
    console.error("Error in single-agent model:", error);
  }
}
var singleAgent_default = handleSingleAgentModel;
