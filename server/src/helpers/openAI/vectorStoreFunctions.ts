import { openai } from "../../index";

export async function setupVectorStoreAndUpdateAssistant(
  vectorStoreId: string,
  assistantId: string,
  userFileId: string
): Promise<void> {
  await openai.beta.vectorStores.files.createAndPoll(vectorStoreId, {
    file_id: userFileId,
  });

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
