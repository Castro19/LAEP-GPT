import {
  BulkWriteResult,
  Collection,
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
} from "mongodb";
import { getDb } from "../../connection";
import {
  FlowchartData,
  FlowchartDocument,
  FlowInfoDocument,
} from "@polylink/shared/types";

let flowchartCollection: Collection<FlowchartDocument>;

const initializeCollection = (): void => {
  flowchartCollection = getDb().collection("flowcharts");
};

// Create
// Make a 1:many relationship between the user and the flowchart
export const createFlowchart = async (
  flowchartData: FlowchartData,
  name: string,
  primaryOption: boolean,
  userId: string,
  flowInfo: FlowInfoDocument
): Promise<InsertOneResult<FlowchartDocument>> => {
  if (!flowchartCollection) initializeCollection();
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
      flowInfo,
      createdAt: new Date(), // Adding timestamp for better tracking
      updatedAt: new Date(),
    } as FlowchartDocument);
    return result;
  } catch (error) {
    throw new Error(
      "Error creating flowchart in database: " + (error as Error).message
    );
  }
};

// Read
// Create 403 error if the user is not the owner of the flowchart
// Create 404 error if the flowchart does not exist
export const fetchFlowchart = async (
  flowchartId: string,
  userId: string
): Promise<FlowchartDocument | null> => {
  if (!flowchartCollection) initializeCollection();
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
    throw new Error(
      "Error fetching flowchart from database: " + (error as Error).message
    );
  }
};

// Read All
export const fetchAllFlowcharts = async (
  userId: string
): Promise<FlowchartDocument[]> => {
  if (!flowchartCollection) initializeCollection();
  try {
    // Only return the flowchartId: _id and the name
    const result = await flowchartCollection
      .find(
        { userId },
        { projection: { _id: 1, name: 1, primaryOption: 1, updatedAt: 1 } }
      )
      .toArray();
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching all flowcharts from database: " + (error as Error).message
    );
  }
};

// Update
export const updateFlowchart = async (
  flowchartId: string,
  flowchartData: FlowchartData,
  name: string,
  primaryOption: boolean,
  userId: string
): Promise<UpdateResult> => {
  if (!flowchartCollection) initializeCollection();
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
    throw new Error(
      "Error updating flowchart in database: " + (error as Error).message
    );
  }
};

// Delete
export const deleteFlowchart = async (
  flowchartId: string,
  userId: string
): Promise<DeleteResult> => {
  if (!flowchartCollection) initializeCollection();
  try {
    // First, get the existing document
    const existingDoc = await flowchartCollection.findOne({
      _id: new ObjectId(flowchartId),
      userId,
    });
    // User ID does not match
    if (existingDoc?.userId !== userId) {
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
    throw new Error(
      "Error deleting flowchart from database: " + (error as Error).message
    );
  }
};

// Other Handlers
export const updateAllOtherFlowcharts = async (
  flowchartId: string,
  userId: string
): Promise<BulkWriteResult> => {
  if (!flowchartCollection) initializeCollection();
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
      `Error updating flowchart primary options: ${(error as Error).message}`
    );
  }
};

export const fetchPrimaryFlowchart = async (
  userId: string
): Promise<FlowchartDocument | null> => {
  if (!flowchartCollection) initializeCollection();
  try {
    const result = await flowchartCollection.findOne({
      userId,
      primaryOption: true,
    });
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching primary flowchart from database: " +
        (error as Error).message
    );
  }
};
