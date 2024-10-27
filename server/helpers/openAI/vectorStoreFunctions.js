import { openai } from "../../index.js";

export async function setupVectorStoreWithFile(
  threadId,
  assistantId,
  userFileId
) {
  const vectorStore = await openai.beta.vectorStores.create({
    name: String(threadId),
  });
  const vectorStoreId = vectorStore.id;

  await openai.beta.vectorStores.files.createAndPoll(vectorStoreId, {
    file_id: userFileId,
  });

  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: { vector_store_ids: [vectorStoreId] },
    },
    tools: [{ type: "file_search" }],
  });

  return vectorStoreId;
}

export async function setupVectorStoreAndUpdateAssistant(
  vectorStoreId,
  assistantId,
  userFileId
) {
  if (userFileId) {
    await openai.beta.vectorStores.files.createAndPoll(vectorStoreId, {
      file_id: userFileId,
    });
  }

  const vectorStoreFiles =
    await openai.beta.vectorStores.files.list(vectorStoreId);

  if (vectorStoreFiles.data.length > 0) {
    await openai.beta.assistants.update(assistantId, {
      tool_resources: {
        file_search: { vector_store_ids: [vectorStoreId] },
      },
      tools: [{ type: "file_search" }],
    });
  }
}
