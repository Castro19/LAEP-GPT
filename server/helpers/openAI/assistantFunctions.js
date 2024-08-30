import { openai } from "../../index.js";
import { getDb } from "../../db/connection.js";

export async function createAssistant(name, description, prompt) {
  try {
    console.log("Starting assistant creation process...");
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Prompt:", prompt);

    // Step 1: Create an Assistant in OpenAI's system
    const assistant = await openai.beta.assistants.create({
      name: name,
      instructions: prompt,
      model: "gpt-4o-mini", // Use the correct model name
      tools: [{ type: "file_search" }], // Add tools if necessary, like Code Interpreter
    });

    console.log("OpenAI Assistant created:", assistant);

    // Extract the necessary data, including the assistant_id
    const assistantData = {
      title: name,
      description: description,
      prompt: prompt,
      assistantId: assistant.id, // Store the assistant's ID from OpenAI
    };

    // Step 2: Save assistant data to MongoDB
    const db = getDb();
    await db.collection("gpts").insertOne(assistantData);

    console.log("Assistant data saved to MongoDB:", assistantData);

    return assistantData;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw new Error("Failed to create assistant");
  }
}

export async function deleteAssistant(assistantId) {
  try {
    const response = await openai.deleteAssistant(assistantId);
    return response;
  } catch (error) {
    console.error("Error deleting assistant:", error);
    throw new Error("Failed to delete assistant");
  }
}

export async function fetchGPTs() {
  try {
    const db = getDb();
    const gpts = await db.collection("gpts").find({}).toArray();

    if (!gpts || gpts.length === 0) {
      console.log("No GPTs found");
      return [];
    }

    const gptList = gpts.map((gpt) => ({
      id: gpt._id.toString(),
      title: gpt.title,
      urlPhoto: gpt.urlPhoto,
    }));

    return gptList;
  } catch (error) {
    console.error("Error fetching GPTs:", error.message);
    throw new Error("Failed to fetch GPTs");
  }
}
