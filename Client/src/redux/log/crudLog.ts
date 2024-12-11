import {
  LogData,
  MessageObjType,
  CreateLogTitleData,
  LogListType,
} from "@polylink/shared/types";
import { UpdateLogTitleData } from "./logSlice";
import { environment } from "@/helpers/getEnvironmentVars";

export default async function createLogTitle(msg: string, modelTitle: string) {
  try {
    // Assuming the title is generated based on the last message or another logic
    const response = await fetch("http://localhost:4000/llms/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, AssistantType: modelTitle }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: CreateLogTitleData = await response.json();

    return data.title;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
  }
}

// Creating Log
export async function createLogItem(logData: LogData): Promise<void> {
  try {
    const response = await fetch("http://localhost:4000/chatLogs", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to create chatlog on server side: ", error);
    }
  }
}

// Reading: Fetch all lofgs by as userID:
export async function fetchAllLogs(): Promise<LogListType[] | never[]> {
  try {
    const response = await fetch("http://localhost:4000/chatLogs", {
      credentials: "include",
    });
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
    const response = await fetch(`http://localhost:4000/chatLogs/${logId}`, {
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

type UpdateLogData = {
  logId: string;
  firebaseUserId: string | null;
  urlPhoto?: string;
  content?: MessageObjType[];
  timestamp?: string;
};
// Update Log (Message gets added)
export async function updateLogItem(logData: UpdateLogData): Promise<void> {
  try {
    const response = await fetch(`http://localhost:4000/chatLogs`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to update chatlog on server side: ", error);
    }
  }
}

// delete Log
export async function deleteLogItem({
  logId,
}: {
  logId: string;
}): Promise<void> {
  try {
    const response = await fetch(`http://localhost:4000/chatLogs/${logId}`, {
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
    const response = await fetch("http://localhost:4000/chatLogs/title", {
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
