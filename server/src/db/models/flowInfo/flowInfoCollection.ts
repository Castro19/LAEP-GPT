import { FlowInfoProjection, FlowInfoDocument, MongoQuery } from "types";
import { getDb } from "../../connection.js";
import { Collection } from "mongodb";

let flowInfoCollection: Collection<FlowInfoDocument>;

const initializeCollection = () => {
  flowInfoCollection = getDb().collection("flowInfo");
};

// Fetch majors by catalog
export const searchFlowInfo = async (
  query: MongoQuery<FlowInfoDocument>,
  projection: FlowInfoProjection
) => {
  if (!flowInfoCollection) initializeCollection();
  try {
    const result = await flowInfoCollection
      .find(query)
      .project({
        _id: 0,
        ...projection,
      })
      .toArray();
    return result as FlowInfoDocument[];
  } catch (error) {
    throw new Error(
      "Error searching flowchart info: " + (error as Error).message
    );
  }
};
