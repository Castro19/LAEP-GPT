import { openai } from "../../index.js";
import {
  addMessageToThread,
  createThread,
} from "../../helpers/openAI/threadFunctions.js";
import { getUserByFirebaseId } from "../../db/models/user/userServices.js";
import { addThread, fetchIds } from "../../db/models/threads/threadServices.js";
import { getGPT } from "../../db/models/gpt/gptServices.js";
import { setupVectorStoreAndUpdateAssistant } from "../../helpers/openAI/vectorStoreFunctions.js";
import { formatAvailability } from "../../helpers/formatters/availabilityFormatter.js";
import { runAssistantAndStreamResponse } from "./streamResponse.js";

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
  let { threadId, vectorStoreId } = (await fetchIds(chatId)) || {};
  if (!threadId) {
    const threadObj = await createThread();
    threadId = threadObj.id;

    const vectorStore = await openai.beta.vectorStores.create({
      name: String(threadId),
    });
    vectorStoreId = vectorStore.id;

    await addThread(chatId, threadId, vectorStoreId);
  }

  // Setup vector store and update assistant
  await setupVectorStoreAndUpdateAssistant(
    vectorStoreId,
    assistantId,
    userFile ? userFile.id : null
  );

  if (model.title === "Matching Assistant") {
    const user = await getUserByFirebaseId(userId);
    const availability = formatAvailability(user.availability);
    const interests = user.interests.join(", ");
    messageToAdd = `My availability: ${availability}\nMy interests: ${interests}\n${message}`;
  } else if (model.title === "CSCI Classes Assistant") {
    const user = await getUserByFirebaseId(userId);
    const year = user.year;
    messageToAdd = `Give me classes for a ${year} student\n${message}`;
  }
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
