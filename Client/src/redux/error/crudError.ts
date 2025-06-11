import { ErrorDocument } from "@polylink/shared/types";
import { environment, serverUrl } from "@/helpers/getEnvironmentVars";

type CreateErrorReportData = Omit<
  ErrorDocument,
  "_id" | "createdAt" | "updatedAt" | "status"
>;

export async function createErrorReport(
  errorData: CreateErrorReportData
): Promise<{ message: string; errorId: string }> {
  try {
    const response = await fetch(`${serverUrl}/errors`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data as { message: string; errorId: string };
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to create error report: ", error);
    }
    throw error;
  }
}
