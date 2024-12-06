import { addMessageToThread } from "../../helpers/openAI/threadFunctions.js";
import { getUserByFirebaseId } from "../../db/models/user/userServices.js";
import { fetchFlowchart } from "../../db/models/flowchart/flowchartServices.js";
import { getGPT } from "../../db/models/gpt/gptServices.js";
import { setupVectorStoreAndUpdateAssistant } from "../../helpers/openAI/vectorStoreFunctions.js";
import { initializeOrFetchIds } from "../../helpers/openAI/threadFunctions.js";
import { formatAvailability } from "../../helpers/formatters/availabilityFormatter.js";
import { runAssistantAndStreamResponse } from "./streamResponse.js";
import { searchCourses } from "../qdrant/qdrantQuery.js";
import { getCourseInfo } from "../../db/models/courses/courseServices.js";
import flowchartHelper from "../flowchart/flowchart.js";

const matchingAssistant = (user, message) => {
  const availability = formatAvailability(user.availability);
  const interests = user.interests.join(", ");
  return `My availability: ${availability}\nMy interests: ${interests}\n${message}`;
};

const csciClassesAssistant = (user, message) => {
  const year = user.year;
  const interests = user.interests.join(", ");
  return `Year: ${year}\nClasses taken: ${user.courses}\nInterests: ${interests}\n${message}`;
};

const flowchartAssistant = async (user, message) => {
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

const courseCatalogAssistant = async (user, message) => {
  const courseIds = await searchCourses(message, null, 5);
  const courseObjects = await getCourseInfo(courseIds);
  const courseDescriptions = JSON.stringify(courseObjects);
  return `Search Results: ${courseDescriptions}\n${message}`;
};

const calpolyClubsAssistant = (user, message) => {
  const interests = user.interests.join(", ");
  const major = user.major;
  return `Interests: ${interests}\nMajor: ${major}\n${message}`;
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
}) {
  let messageToAdd = message;
  const assistantId = (await getGPT(model.id)).assistantId;
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
