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

/**
 * Finds the alternate flowchart code for a given code
 * @param code The code to find the alternate for
 * @returns The alternate code
 */
export const findAlternateFlowchartCode = async (
  code: string
): Promise<string | null> => {
  // 1. Get the flowchart info, major and concentration
  const initialFlowInfo = await flowInfoModel.searchFlowInfo(
    { code: code },
    {
      _id: 0,
      majorName: 1,
      concName: 1,
      code: 1,
    }
  );

  if (!Array.isArray(initialFlowInfo) || initialFlowInfo.length === 0) {
    return null;
  }

  const firstFlowInfo = initialFlowInfo[0] as ConcentrationInfo;

  // 2. Look for the flowinfo with the same major and concentration but for catalog 2022-2026
  const alternateFlowInfo = await flowInfoModel.searchFlowInfo(
    {
      majorName: firstFlowInfo.majorName,
      concName: firstFlowInfo.concName,
      catalog: "2022-2026",
    },
    {
      _id: 0,
      majorName: 1,
      concName: 1,
      code: 1,
    }
  );

  if (Array.isArray(alternateFlowInfo) && alternateFlowInfo.length > 0) {
    return (alternateFlowInfo[0] as ConcentrationInfo).code;
  }

  // 3. If no flowinfo is found, then get the non-concentration flowinfo.
  //
  const nonConcentrationFlowInfo = await flowInfoModel.searchFlowInfo(
    { majorName: firstFlowInfo.majorName, catalog: "2022-2026" },
    {
      _id: 0,
      majorName: 1,
      concName: 1,
      code: 1,
    }
  );

  if (
    Array.isArray(nonConcentrationFlowInfo) &&
    nonConcentrationFlowInfo.length > 0
  ) {
    // Find the flowInfo with the shortest code name
    const shortestCodeFlowInfo = nonConcentrationFlowInfo.reduce(
      (shortest, current) => {
        const currentCode = (current as ConcentrationInfo).code;
        const shortestCode = (shortest as ConcentrationInfo).code;
        return currentCode.length < shortestCode.length ? current : shortest;
      },
      nonConcentrationFlowInfo[0]
    );

    return (shortestCodeFlowInfo as ConcentrationInfo).code;
  }

  return null;
};

// Get the flowinfo for a given code
export const getFlowInfoByCode = async (
  code: string
): Promise<FlowInfoDocument | null> => {
  // Pass an empty projection to get all fields
  // remove the string ".pdf" if it exists in the code
  const codeWithoutPdf = code.replace(".pdf", "");
  const result = await flowInfoModel.searchFlowInfo({ code: codeWithoutPdf }, {
    id: 0,
    _id: 0,
    majorName: 1,
    concName: 1,
    code: 1,
    dataLink: 1,
  } as FlowInfoProjection);
  if (Array.isArray(result) && result.length > 0) {
    return result[0] as FlowInfoDocument;
  }
  return null;
};
