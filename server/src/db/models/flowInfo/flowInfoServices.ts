import {
  FlowInfoDocument,
  FlowInfoProjection,
  MongoQuery,
} from "@polylink/shared/types";
import * as flowInfoModel from "./flowInfoCollection";

// Fetch majors by catalog
export const searchFlowInfo = async ({
  catalog,
  majorName,
  code,
}: {
  catalog: string | undefined;
  majorName: string | undefined;
  code: string | undefined;
}) => {
  let query: MongoQuery<FlowInfoDocument> = {};
  let projection: FlowInfoProjection = {
    majorName: 0,
    concName: 0,
    code: 0,
  };

  if (code) {
    query.code = code;
    projection.majorName = 1;
    projection.concName = 1;
  } else {
    if (catalog) {
      query.catalog = catalog;
      projection.majorName = 1;
    }
    if (majorName) {
      query.majorName = majorName;
      projection.concName = 1;
      projection.code = 1;
    }
  }
  if (Object.keys(query).length === 0) {
    throw new Error("No valid query parameters provided");
  }
  try {
    const result = await flowInfoModel.searchFlowInfo(query, projection);

    // Process results to return unique major names if catalog is provided
    if (majorName && catalog) {
      return result;
    } else if (catalog) {
      const uniqueMajorNames = [
        ...new Set(result.map((item: FlowInfoDocument) => item.majorName)),
      ];
      return uniqueMajorNames;
    }

    return result;
  } catch (error) {
    console.error("Error searching flowinfo:", error);
    return null;
  }
};
