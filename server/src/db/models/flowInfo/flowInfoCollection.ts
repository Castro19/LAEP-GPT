import {
  FlowInfoProjection,
  FlowInfoDocument,
  MongoQuery,
  ConcentrationInfo,
} from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection } from "mongodb";

let flowInfoCollection: Collection<FlowInfoDocument>;

const initializeCollection = (): void => {
  flowInfoCollection = getDb().collection("flowInfo");
};

// Fetch majors by catalog
export const searchFlowInfo = async (
  query: MongoQuery<FlowInfoDocument>,
  projection: FlowInfoProjection
): Promise<ConcentrationInfo[] | string[]> => {
  if (!flowInfoCollection) initializeCollection();
  try {
    // Convert projection to ensure all fields are either included (1) or all excluded (0)
    const normalizedProjection = Object.entries(projection).reduce(
      (acc, [key, value]) => {
        // If any field is set to 1, convert all 0s to 1s (except _id which can be mixed)
        const hasInclusion = Object.values(projection).includes(1);
        if (hasInclusion && value === 0 && key !== "_id") {
          return { ...acc, [key]: 1 };
        }
        return { ...acc, [key]: value };
      },
      {}
    );

    const result = await flowInfoCollection
      .find(query)
      .project(normalizedProjection)
      .toArray();
    return result as ConcentrationInfo[] | string[];
  } catch (error) {
    throw new Error(
      "Error searching flowchart info: " + (error as Error).message
    );
  }
};
