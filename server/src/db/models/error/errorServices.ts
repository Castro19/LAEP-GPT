import { ErrorDocument } from "@polylink/shared/types";
import * as errorModel from "./errorCollection";
import { environment } from "../../../index";

// Create a new error report
export const createErrorReport = async (
  errorData: Omit<ErrorDocument, "_id" | "createdAt" | "updatedAt" | "status">
): Promise<{ message: string; errorId: string }> => {
  try {
    const result = await errorModel.createErrorReport(errorData);
    if (!result.acknowledged) {
      throw new Error("Failed to create error report");
    }
    return {
      message: "Error report created successfully",
      errorId: result.insertedId.toString(),
    };
  } catch (error) {
    if (environment === "dev") {
      console.error("Service error in createErrorReport:", error);
    }
    throw new Error("Service error: " + (error as Error).message);
  }
};
