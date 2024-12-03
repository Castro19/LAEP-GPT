import { openai, formatAssistantId } from "../../index.js";

// Add a message to the thread
async function addMessage(threadId, message) {
  console.log("Adding a new message to thread: " + threadId);
  const response = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });
  return response;
}

// Run the assistant
async function runAssistant(threadId) {
  console.log("Running assistant for thread: " + threadId);
  const response = await openai.beta.threads.runs.create(threadId, {
    assistant_id: formatAssistantId,
  });
  return response;
}

export const helperAssistant = async (message) => {
  // Create a new thread
  const threadObject = await openai.beta.threads.create();

  // Add the user's message to the thread
  await addMessage(threadObject.id, message);

  // Run the assistant
  const run = await runAssistant(threadObject.id);
  const runId = run.id;

  // Wait for the assistant run to complete
  let status = "";
  while (status !== "completed") {
    const runObject = await openai.beta.threads.runs.retrieve(
      threadObject.id,
      runId
    );
    status = runObject.status;
    console.log("Current status: " + status);

    if (status === "completed") {
      break;
    } else if (status === "failed") {
      throw new Error("Assistant run failed");
    }

    // Wait for a short period before checking again (e.g., 500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  await openai.beta.threads.del(threadObject.id);

  // Once completed, retrieve the assistant's response
  const messagesList = await openai.beta.threads.messages.list(threadObject.id);
  const data = messagesList.body.data;

  // Filter out the assistant's messages and get the last one
  const assistantMessages = data.filter((msg) => msg.role === "assistant");
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
  const contentArray = lastAssistantMessage.content; // This is an array

  if (contentArray.length === 0) {
    throw new Error("Assistant response is empty");
  }

  // Extract the 'value' field from the first element
  const firstContentItem = contentArray[0];
  const value = firstContentItem.text.value;

  // Parse the JSON string into a JavaScript object
  let jsonObject;
  try {
    jsonObject = JSON.parse(value);
  } catch (error) {
    throw new Error("Failed to parse JSON: " + error.message);
  }

  // Return the JSON object
  return jsonObject;
};
