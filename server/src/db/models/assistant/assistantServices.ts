import { GptTypeDB } from "@polylink/shared/types";
import * as gptModel from "./assistantCollection.js";

// Read All
export const fetchAssistants = async () => {
  try {
    // Potential Future: Certain assistants are only visible to certain users
    const result = await gptModel.viewGPTs();

    const gptList = result.map((gpt: GptTypeDB) => ({
      id: gpt._id,
      title: gpt.title,
      desc: gpt.desc,
      urlPhoto: gpt.urlPhoto,
      suggestedQuestions: gpt.suggestedQuestions,
    }));
    return gptList;
  } catch (error) {
    console.error("CONSOLE LOG ERROR: ", error);
  }
};

export const getAssistantById = async (gptId: string) => {
  try {
    const result = await gptModel.findAssistantById(gptId);
    return result;
  } catch (error) {
    throw new Error(
      "Error finding GPT from database: " + (error as Error).message
    );
  }
};
