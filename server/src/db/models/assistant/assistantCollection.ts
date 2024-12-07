import { Collection, ObjectId } from "mongodb";
import { getDb } from "../../connection.js";
import { GptTypeDB } from "@polylink/shared/types";

let gptCollection: Collection<GptTypeDB>;

const initializeCollection = () => {
  gptCollection = getDb().collection("gpts");
};

export const viewGPTs = async () => {
  if (!gptCollection) initializeCollection();
  try {
    const result = await gptCollection.find({}).toArray();
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching GPTs from database: " + (error as Error).message
    );
  }
};

export const findAssistantById = async (gptId: string) => {
  try {
    const result = await gptCollection.findOne({
      _id: new ObjectId(gptId) as unknown as string,
    });
    return result;
  } catch (error) {
    throw new Error(
      "Error finding GPT from database: " + (error as Error).message
    );
  }
};
