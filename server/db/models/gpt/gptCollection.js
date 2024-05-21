import { ObjectId } from "mongodb";
import db from "../../connection.js";

const gptCollection = db.collection("gpts");

// Create
export const addGpt = async (gptData) => {
  try {
    const result = await gptCollection.insertOne(gptData);
    return result;
  } catch (error) {
    throw new Error("Error creating gpt in database: " + error.message);
  }
};

// Read
export const viewGPTs = async (userId) => {
  try {
    const result = await gptCollection.find({}).toArray();
    return result;
  } catch (error) {
    throw new Error("Error fetching GPTs from database: " + error.message);
  }
};

// Read one:
export const getGptById = async (gptId) => {
  try {
    const result = await gptCollection.findOne({ _id: new ObjectId(gptId) });
    return result;
  } catch (error) {
    throw new Error("Error finding GPT from database: " + error.message);
  }
};
// Delete
export const removeGpt = async (gptId) => {
  try {
    const result = await gptCollection.deleteOne({
      _id: new ObjectId(gptId),
    });
    console.log("Result of removing GPT: ", result);
  } catch (error) {
    throw new Error("Error Deleting GPT: " + error.message);
  }
};

// Helpers
export const findAsstId = async (gptId) => {
  try {
    const asstId = await gptCollection.findOne(
      {
        _id: new ObjectId(gptId),
      },
      {
        projection: {
          assistantId: 1,
        },
      }
    );
    if (!asstId) {
      throw new Error("Assistant not found");
    }
    return asstId;
  } catch (error) {
    throw new Error(`Failed to get Assistant: ${error.message}`);
  }
};
