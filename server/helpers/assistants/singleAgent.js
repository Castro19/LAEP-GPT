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

  // Create thread and vector store if not already created
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
    const availability = formatAvailability(user.availability);
    const interests = user.interests.join(", ");
    messageToAdd = `My availability: ${availability}\nMy interests: ${interests}\n${message}`;
  } else if (model.title === "CSCI Classes Assistant") {
    const year = user.year;
    messageToAdd = `Year: ${year}\nClasses taken: ${user.courses}\nInterests: ${user.interests}\n${message}`;
  } else if (model.title === "Flowchart Assistant") {
    const flowchart = await fetchFlowchart(user.flowchartId, userId);
    const catalogYear = user.catalog;

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
    } = await flowchartHelper(flowchart.flowchartData.termData, catalogYear);

    const interests = user.interests.join(", ");
    const year = user.year;
    messageToAdd = `Required Courses: ${formattedRequiredCourses}\nTech Electives Left: ${techElectivesLeft}\nGeneral Writing Met: ${generalWritingMet}\nUSCP Met: ${uscpMet}\nYear: ${year}\nInterests: ${interests}\n${message}`;
    messageToAdd = `Search Results: ${courseDescriptions}\n${message}`;
  } else if (model.title === "Course Catalog") {
    const courseIds = await searchCourses(message, null, 5);
    const courseObjects = await getCourseInfo(courseIds);
    const courseDescriptions = JSON.stringify(courseObjects);
    messageToAdd = `Search Results: ${courseDescriptions}\n${message}`;
  } else if (model.title === "Calpoly Clubs") {
    const interests = user.interests.join(", ");
    const major = user.major;
    messageToAdd = `Interests: ${interests}\nMajor: ${major}\n${message}`;
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
