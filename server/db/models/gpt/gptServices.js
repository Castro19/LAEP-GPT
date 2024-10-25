import * as gptModel from "./gptCollection.js";
import {
  createAssistant,
  deleteAssistant,
} from "../../../helpers/openAI/assistantFunctions.js";
// create
export const createGpt = async (gptData) => {
  try {
    const newAssistant = await createAssistant(
      gptData.title,
      gptData.desc,
      gptData.instructions
    );
    console.log("NEW ASSISTANT: ", newAssistant);

    const dbAssistant = {
      assistantId: newAssistant.id,
      userId: gptData.userId,
      title: gptData.title,
      desc: gptData.desc,
      urlPhoto: gptData.urlPhoto,
    };
    const result = await gptModel.addGpt(dbAssistant);
    console.log("GPT Inserted into MongoDB");

    const newGpt = {
      id: result.insertedId,
      title: gptData.title,
      desc: gptData.desc,
      urlPhoto: gptData.urlPhoto,
    };
    return newGpt;
  } catch (error) {
    throw new Error("Service error Creating GPT: " + error.message);
  }
};

// Read All
export const fetchGPTs = async (userId) => {
  try {
    const result = await gptModel.viewGPTs(userId);

    const gptList = result.map((gpt) => ({
      id: gpt._id,
      title: gpt.title,
      desc: gpt.desc,
      urlPhoto: gpt.urlPhoto,
    }));
    return gptList;
  } catch (error) {
    console.error("CONSOLE LOG ERROR: ", error);
  }
};

// Read one:
export const getGPT = async (gptId) => {
  try {
    const result = await gptModel.getGptById(gptId);
    return result;
  } catch (error) {
    console.error("Error finding model: ", error);
  }
};
// Delete
export const deleteGpt = async (gptId) => {
  try {
    // 1. Fetch the assistant id from databse with given gpt ID
    const assistantResponse = await gptModel.findAsstId(gptId);
    const assistantId = assistantResponse.assistantId;
    // 2. Delete the assistant id from openai w/ api
    await deleteAssistant(assistantId);
    // 3. Delete the row from database collection
    await gptModel.removeGpt(gptId);
    // 4. Return success response
    return { message: `GPT ${assistantId} was deleted!` };
  } catch (error) {
    throw new Error("Service error deleting GPT: " + error.message);
  }
};
