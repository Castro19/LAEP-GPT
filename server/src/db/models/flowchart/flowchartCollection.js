import db from "../../connection.js";
import { ObjectId } from "mongodb";
const flowchartCollection = db.collection("flowcharts");

// Create
// Make a 1:many relationship between the user and the flowchart
export const createFlowchart = async (
  flowchartData,
  name,
  primaryOption,
  userId
) => {
  try {
    // Validate that userId exists and is valid
    if (!userId || typeof userId !== "string") {
      throw new Error("Valid userId is required");
    }

    const result = await flowchartCollection.insertOne({
      flowchartData,
      name,
      primaryOption,
      userId,
      createdAt: new Date(), // Adding timestamp for better tracking
      updatedAt: new Date(),
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

// Read All
export const fetchAllFlowcharts = async (userId) => {
  try {
    // Only return the flowchartId: _id and the name
    const result = await flowchartCollection
      .find({ userId }, { projection: { _id: 1, name: 1, primaryOption: 1 } })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching all flowcharts from database: " + error.message
    );
  }
};

// Update
export const updateFlowchart = async (
  flowchartId,
  flowchartData,
  name,
  primaryOption,
  userId
) => {
  try {
    // First, get the existing document
    const existingDoc = await flowchartCollection.findOne({
      _id: new ObjectId(flowchartId),
      userId,
    });

    if (!existingDoc) {
      throw new Error("Flowchart not found");
    }

    let result;
    // Only update flowchartData if it is not null
    if (flowchartData) {
      result = await flowchartCollection.updateOne(
        { _id: new ObjectId(flowchartId), userId },
        {
          $set: {
            flowchartData: flowchartData,
            name: name,
            primaryOption: primaryOption,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      result = await flowchartCollection.updateOne(
        { _id: new ObjectId(flowchartId), userId },
        {
          $set: {
            name: name,
            primaryOption: primaryOption,
            updatedAt: new Date(),
          },
        }
      );
    }

    if (!result.matchedCount) {
      throw new Error("Flowchart not found");
    }
    if (!result.modifiedCount) {
      throw new Error(
        "No changes detected. The data you're trying to save is identical to what's already stored."
      );
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete
export const deleteFlowchart = async (flowchartId, userId) => {
  try {
    // First, get the existing document
    const existingDoc = await flowchartCollection.findOne({
      _id: new ObjectId(flowchartId),
      userId,
    });
    // User ID does not match
    if (existingDoc.userId !== userId) {
      throw new Error("Forbidden");
    }
    const result = await flowchartCollection.deleteOne({
      _id: new ObjectId(flowchartId),
      userId,
    });
    if (!result.deletedCount) {
      throw new Error("Flowchart not found");
    }

    return result;
  } catch (error) {
    throw new Error("Error deleting flowchart from database: " + error.message);
  }
};

// Other Handlers
export const updateAllOtherFlowcharts = async (flowchartId, userId) => {
  try {
    // Use bulkWrite to perform both operations atomically
    const result = await flowchartCollection.bulkWrite([
      {
        // Set the specified flowchart to primary
        updateOne: {
          filter: { _id: new ObjectId(flowchartId), userId },
          update: { $set: { primaryOption: true } },
        },
      },
      {
        // Set all other flowcharts to not primary
        updateMany: {
          filter: { userId, _id: { $ne: new ObjectId(flowchartId) } },
          update: { $set: { primaryOption: false } },
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(
      `Error updating flowchart primary options: ${error.message}`
    );
  }
};
