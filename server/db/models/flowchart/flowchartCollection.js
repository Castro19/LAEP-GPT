import db from "../../connection.js";
import { ObjectId } from "mongodb";
const flowchartCollection = db.collection("flowcharts");

// Create
// Make it so that we have a 1:1 relationship between the user and the flowchart
// If the user already has a flowchart, we update it, otherwise we create a new one
export const createFlowchart = async (flowchartData, userId) => {
  try {
    const result = await flowchartCollection.insertOne({
      flowchartData: JSON.parse(flowchartData),
      userId,
    });
    return result;
  } catch (error) {
    throw new Error("Error creating flowchart in database: " + error.message);
  }
};

// Read
// Create 403 error if the user is not the owner of the flowchart
// Create 404 error if the flowchart does not exist
export const fetchFlowchart = async (flowchartId, userId) => {
  try {
    const result = await flowchartCollection.findOne({
      _id: new ObjectId(flowchartId),
      userId,
    });
    if (!result) {
      // 404 error
      throw new Error("Flowchart not found");
    }
    if (result.userId !== userId) {
      // 403 error
      throw new Error("Forbidden");
    }
    return result;
  } catch (error) {
    throw new Error("Error fetching flowchart from database: " + error.message);
  }
};
