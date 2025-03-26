import { addMessageToThread } from "../openAI/threadFunctions";
import { getUserByFirebaseId } from "../../db/models/user/userServices";
import { fetchFlowchart } from "../../db/models/flowchart/flowchartServices";
import { getAssistantById } from "../../db/models/assistant/assistantServices";
import { initializeOrFetchIds } from "../openAI/threadFunctions";
import { runAssistantAndStreamResponse } from "./multiAgentHelpers/streamResponse";
import { searchCourses } from "../qdrant/qdrantQuery";
import { getCourseInfo } from "../../db/models/courses/courseServices";
import flowchartHelper from "../flowchart/flowchart";
import { RunningStreamData, UserData } from "@polylink/shared/types";
import { Response } from "express";
import { environment } from "../../index";

const flowchartAssistant = async (
  user: UserData,
  message: string
): Promise<string> => {
  const flowchart = await fetchFlowchart(
    user.flowchartInformation.flowchartId,
    user.userId
  );
  // const courseIds = await searchCourses(message, null, 5);
  // const courseObjects = await getCourseInfo(courseIds);
  // const courseDescriptions = JSON.stringify(courseObjects);

  const {
    formattedRequiredCourses,
    techElectivesLeft,
    generalWritingMet,
    uscpMet,
  } = await flowchartHelper(
    flowchart.flowchartData.termData,
    user.flowchartInformation.catalog
  );

  const interests = user.interestAreas.join(", ");
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
  const interests = user.interestAreas.join(", ");
  const preferredActivities = user.preferredActivities.join(", ");
  const goals = user.goals.join(", ");
  const major = user.flowchartInformation.major;
  const demographic = JSON.stringify(user.demographic);
  return `Interests: ${interests}\nPreferred Activities: ${preferredActivities}\nMajor: ${major}\nGoals: ${goals}\nDemographic: ${demographic}\n${message}`;
};

type SingleAgentRequestBody = {
  model: { id: string; title: string };
  chatId: string;
  message: string;
  res: Response;
  userId: string;
  userMessageId: string;
  runningStreams: RunningStreamData;
};

async function handleSingleAgentModel({
  model,
  chatId,
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
  const { threadId } = await initializeOrFetchIds(chatId, model.id);
  // Add threadId to runningStreams
  runningStreams[userMessageId].threadId = threadId;

  const user = await getUserByFirebaseId(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (model.title === "Flowchart Assistant") {
    messageToAdd = await flowchartAssistant(user, message);
  } else if (model.title === "Course Catalog") {
    messageToAdd = await courseCatalogAssistant(user, message);
  } else if (model.title === "Calpoly Clubs") {
    messageToAdd = calpolyClubsAssistant(user, message);
  }

  if (environment === "dev") {
    console.log("messageToAdd: ", messageToAdd);
  }
  try {
    // Stream assistant's response
    await runAssistantAndStreamResponse(
      threadId,
      assistantId,
      res,
      userMessageId,
      runningStreams
    );

    // Add user message to thread
    await addMessageToThread(threadId, "user", messageToAdd);
  } catch (error) {
    if (environment === "dev") {
      console.error("Error in single-agent model:", error);
    }
  }
}

export default handleSingleAgentModel;
