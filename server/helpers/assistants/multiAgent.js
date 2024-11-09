// import { openai } from "../../index.js";
import {
  addMessageToThread,
  createThread,
} from "../../helpers/openAI/threadFunctions.js";
// import { getUserByFirebaseId } from "../../db/models/user/userServices.js";
// import { addThread, fetchIds } from "../../db/models/threads/threadServices.js";
import { getGPT } from "../../db/models/gpt/gptServices.js";
import { setupVectorStoreWithFile } from "../../helpers/openAI/vectorStoreFunctions.js";
// import { formatAvailability } from "../../helpers/formatters/availabilityFormatter.js";
import {
  runAssistantAndStreamResponse,
  runAssistantAndCollectResponse,
} from "./streamResponse.js";

async function handleMultiAgentModel({ userFile, message, res, file }) {
  // Sub-assistants and leading assistant IDs
  const subGPTIds = ["66e7b2784a61f99d73371faf", "66e7b3184a61f99d73371fb0"];
  const leadingGPTId = "66ec7a68194da294fe19139e";
  const assistantIds = [];
  const threadIds = [];

  // Fetch assistant IDs
  for (const subGPTId of subGPTIds) {
    const assistantId = (await getGPT(subGPTId)).assistantId;
    assistantIds.push(assistantId);
  }

  // Create threads and add messages
  for (const assistantId of assistantIds) {
    const threadObj = await createThread();
    const threadId = threadObj.id;
    threadIds.push(threadId);

    if (file) {
      await setupVectorStoreWithFile(threadId, assistantId, userFile.id);
    }

    await addMessageToThread(
      threadId,
      "user",
      message,
      file ? userFile.id : null
    );
  }

  // Collect responses from sub-assistants
  const assistantResponses = [];

  for (const [index, assistantId] of assistantIds.entries()) {
    const assistantResponse = await runAssistantAndCollectResponse(
      threadIds[index],
      assistantId
    );
    assistantResponses.push(assistantResponse);
  }

  // Combine responses
  const combinedResponse = `**Ethical Assessment:**\n\n${assistantResponses[0]}\n\n**Social Justice Evaluation:**\n\n${assistantResponses[1]}`;

  const finalAssistantId = (await getGPT(leadingGPTId)).assistantId;
  const finalThreadObj = await createThread();
  const finalThreadId = finalThreadObj.id;

  if (file) {
    await setupVectorStoreWithFile(
      finalThreadId,
      finalAssistantId,
      userFile.id
    );
  }

  // Add combined response as user message
  await addMessageToThread(finalThreadId, "user", combinedResponse, null);

  // Stream final assistant's response
  await runAssistantAndStreamResponse(finalThreadId, finalAssistantId, res);
}

export default handleMultiAgentModel;
