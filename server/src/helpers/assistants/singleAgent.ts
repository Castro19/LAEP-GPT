import { addMessageToThread } from "../openAI/threadFunctions.js";
import { getUserByFirebaseId } from "../../db/models/user/userServices.js";
import { fetchFlowchart } from "../../db/models/flowchart/flowchartServices.js";
import { getAssistantById } from "../../db/models/assistant/assistantServices.js";
import { setupVectorStoreAndUpdateAssistant } from "../openAI/vectorStoreFunctions.js";
import { initializeOrFetchIds } from "../openAI/threadFunctions.js";
import { formatAvailability } from "../formatters/availabilityFormatter";
import { runAssistantAndStreamResponse } from "./streamResponse";
import { searchCourses } from "../qdrant/qdrantQuery.js";
import { getCourseInfo } from "../../db/models/courses/courseServices.js";
import flowchartHelper from "../flowchart/flowchart.js";
import { RunningStreamData, UserData } from "@polylink/shared/types";
import { FileObject } from "openai/resources/index.mjs";
import { Response } from "express";

const matchingAssistant = (user: UserData, message: string): string => {
  const availability = formatAvailability(user.availability);
  const interests = user.interests.join(", ");
  return `My availability: ${availability}\nMy interests: ${interests}\n${message}`;
};

const csciClassesAssistant = (user: UserData, message: string): string => {
  const year = user.year;
  const interests = user.interests.join(", ");
  return `Year: ${year}\nClasses taken: ${user.courses}\nInterests: ${interests}\n${message}`;
};

const flowchartAssistant = async (
  user: UserData,
  message: string
): Promise<string> => {
  const flowchart = await fetchFlowchart(user.flowchartId, user.userId);
  const courseIds = await searchCourses(message, null, 5);
  console.log("courseIds: ", courseIds);
  const courseObjects = await getCourseInfo(courseIds);
  const courseDescriptions = JSON.stringify(courseObjects);
  console.log("courseDescriptions: ", courseDescriptions);
  const {
    formattedRequiredCourses,
    techElectivesLeft,
    generalWritingMet,
    uscpMet,
  } = await flowchartHelper(flowchart.flowchartData.termData, user.catalog);

  const interests = user.interests.join(", ");
  const year = user.year;
  return `Required Courses: ${formattedRequiredCourses}\nTech Electives Left: ${techElectivesLeft}\nGeneral Writing Met: ${generalWritingMet}\nUSCP Met: ${uscpMet}\nYear: ${year}\nInterests: ${interests}\n${message}`;
};

const courseCatalogAssistant = async (
  user: UserData,
  message: string
): Promise<string> => {
  const courseIds = await searchCourses(message, null, 5);
  const courseObjects = await getCourseInfo(courseIds);
  const courseDescriptions = JSON.stringify(courseObjects);
  return `Search Results: ${courseDescriptions}\n${message}`;
};

const calpolyClubsAssistant = (user: UserData, message: string): string => {
  const interests = user.interests.join(", ");
  const major = user.major;
  return `Interests: ${interests}\nMajor: ${major}\n${message}`;
};

type SingleAgentRequestBody = {
  model: { id: string; title: string };
  chatId: string;
  userFile: FileObject | null;
  message: string;
  res: Response;
  userId: string;
  userMessageId: string;
  runningStreams: RunningStreamData;
};

async function handleSingleAgentModel({
  model,
  chatId,
  userFile,
  message,
  res,
  userId,
  userMessageId,
  runningStreams,
}: SingleAgentRequestBody): Promise<void> {
  let messageToAdd = message;
  const assistant = await getAssistantById(model.id);
  if (!assistant) {
    throw new Error("Assistant not found");
  }
  const assistantId = assistant.assistantId;
  if (!assistantId) {
    throw new Error("Assistant ID not found");
  }
  // Creates from OpenAI API & Stores in DB if not already created
  const { threadId, vectorStoreId } = await initializeOrFetchIds(chatId);
  runningStreams[userMessageId].threadId = threadId;
  // Setup vector store and update assistant
  await setupVectorStoreAndUpdateAssistant(
    vectorStoreId,
    assistantId,
    userFile ? userFile.id : null
  );
  const user = await getUserByFirebaseId(userId);

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
    // Add user message to thread
    await addMessageToThread(
      threadId,
      "user",
      messageToAdd,
      userFile ? userFile.id : null,
      model.title
    );

    // Stream assistant's response
    await runAssistantAndStreamResponse(
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

export default handleSingleAgentModel;
