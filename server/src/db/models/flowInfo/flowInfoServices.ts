import {
  ConcentrationInfo,
  FlowInfoDocument,
  FlowInfoProjection,
} from "@polylink/shared/types";
import * as flowInfoModel from "./flowInfoCollection";
import { environment } from "../../../index";
import { MongoQuery } from "../../../types/mongo";
// First, define the return type using a type predicate function
function isMajorNameAndCatalog(
  majorName: string | undefined,
  catalog: string | undefined
): majorName is string {
  return !!majorName && !!catalog;
}

// Fetch majors by catalog
export const searchFlowInfo = async ({
  catalog,
  majorName,
  code,
}: {
  catalog: string | undefined;
  majorName: string | undefined;
  code: string | undefined;
}): Promise<ConcentrationInfo[] | string[] | null> => {
  const query: MongoQuery<FlowInfoDocument> = {};
  const projection: FlowInfoProjection = {
    _id: 0,
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

    if (isMajorNameAndCatalog(majorName, catalog)) {
      return result as ConcentrationInfo[];
    } else if (catalog) {
      const uniqueMajorNames: string[] = [
        ...new Set(result.map((item) => (item as ConcentrationInfo).majorName)),
      ];
      return uniqueMajorNames;
    } else if (code) {
      return result as ConcentrationInfo[];
    }
    return null;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error searching flowinfo:", error);
    }
    return null;
  }
};
