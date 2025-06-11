import { Collection, InsertOneResult } from "mongodb";
import { getDb } from "../../connection";
import { ErrorDocument } from "@polylink/shared/types";

let errorCollection: Collection<ErrorDocument>;

const initializeCollection = (): void => {
  errorCollection = getDb().collection("errors");
};

// Create a new error report
export const createErrorReport = async (
  errorData: Omit<ErrorDocument, "_id" | "createdAt" | "updatedAt" | "status">
): Promise<InsertOneResult<ErrorDocument>> => {
  if (!errorCollection) initializeCollection();
  try {
    const result = await errorCollection.insertOne({
      ...errorData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "open",
    } as ErrorDocument);
    return result;
  } catch (error) {
    throw new Error(
      "Error creating error report in database: " + (error as Error).message
    );
  }
};
