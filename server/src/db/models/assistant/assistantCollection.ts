import { Collection, ObjectId } from "mongodb";
import { getDb } from "../../connection.js";
import { AssistantDocument } from "@polylink/shared/types";

let assistantCollection: Collection<AssistantDocument>;

const initializeCollection: () => void = () => {
  assistantCollection = getDb().collection("gpts");
};

export const viewGPTs: () => Promise<AssistantDocument[]> = async () => {
  if (!assistantCollection) initializeCollection();
  try {
    const result = await assistantCollection.find({}).toArray();
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching Assistants from database: " + (error as Error).message
    );
  }
};

export const findAssistantById: (
  gptId: string
) => Promise<AssistantDocument | null> = async (gptId: string) => {
  try {
    const result = await assistantCollection.findOne({
      _id: new ObjectId(gptId) as unknown as string,
    });
    return result;
  } catch (error) {
    throw new Error(
      "Error finding Assistant from database: " + (error as Error).message
    );
  }
};
