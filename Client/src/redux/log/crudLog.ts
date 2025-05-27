import { LogData, LogListType, MessageObjType } from "@polylink/shared/types";
import { UpdateLogTitleData } from "./logSlice";
import { environment, serverUrl } from "@/helpers/getEnvironmentVars";

// Reading: Fetch logs by pagination with userID:
export async function fetchLogsByPage(
  page: number = 1,
  limit: number = 20
): Promise<LogListType[] | never[]> {
  try {
    const response = await fetch(
      `${serverUrl}/chatLogs?page=${page}&limit=${limit}`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      if (environment === "dev") {
        console.error("Response Error  fetching chat Logs");
      }
      return [];
    }
    const logs: LogListType[] = await response.json();
    return logs;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to fetch logs: ", error);
    }
    return []; // serialiazable fallback
  }
}

export async function fetchLogById(logId: string): Promise<LogData | never[]> {
  try {
    const response = await fetch(`${serverUrl}/chatLogs/${logId}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const log: LogData = await response.json();
    return log;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to fetch log by id: ", error);
    }
    return [];
  }
}

// delete Log
export async function deleteLogItem({
  logId,
}: {
  logId: string;
}): Promise<void> {
  try {
    const response = await fetch(`${serverUrl}/chatLogs/${logId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Error: ", response.status);
      throw new Error("Failed to reach server when deleting log: " + response);
    }
    return;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error: ", error);
    }
  }
}

// Reurn {message, logId, title}
export async function updateLogTitleInDB({
  logId,
  title,
}: UpdateLogTitleData): Promise<{
  message: string;
  logId: string;
  title: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/chatLogs/title`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId, title }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data as { message: string; logId: string; title: string };
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to update log title: ", error);
    }
    throw error;
  }
}

type UpsertLogData = {
  logId: string;
  content: MessageObjType[];
  assistantMongoId?: string;
  msg?: string;
};

export async function upsertLogItem(logData: UpsertLogData): Promise<{
  timestamp: string;
  isNewChat: boolean;
  title: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/chatLogs`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const { timestamp, isNewChat, title } = await response.json();
    return { timestamp, isNewChat, title };
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to upsert log: ", error);
    }
    throw error;
  }
}
