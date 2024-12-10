import { AssistantDocument, AssistantType } from "@polylink/shared/types";
import * as assistantModel from "./assistantCollection";

// Read All
export const fetchAssistants: () => Promise<AssistantType[]> = async () => {
  try {
    // Potential Future: Certain assistants are only visible to certain users
    const result = await assistantModel.viewGPTs();

    if (!result) throw new Error("No assistants found");
    const assistantList = result.map((assistant: AssistantDocument) => ({
      id: assistant._id.toString(),
      title: assistant.title,
      desc: assistant.desc,
      urlPhoto: assistant.urlPhoto,
      suggestedQuestions: assistant.suggestedQuestions,
    })) as AssistantType[];

    return assistantList;
  } catch (error) {
    console.error("CONSOLE LOG ERROR: ", error);
    throw new Error("Error fetching assistants: " + (error as Error).message);
  }
};

export const getAssistantById: (
  gptId: string
) => Promise<AssistantDocument | null> = async (gptId: string) => {
  try {
    const result = await assistantModel.findAssistantById(gptId);
    return result;
  } catch (error) {
    throw new Error(
      "Error finding GPT from database: " + (error as Error).message
    );
  }
};
