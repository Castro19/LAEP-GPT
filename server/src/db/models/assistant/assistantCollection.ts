import { Collection, ObjectId } from "mongodb";
import { getDb } from "../../connection.js";
import { GptTypeDB } from "types/gpt/index.js";

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
