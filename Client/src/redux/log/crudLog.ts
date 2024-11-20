import { LogData, MessageObjType } from "@/types";
import { UpdateLogTitleData } from "./logSlice";

export default async function createLogTitle(msg: string, modelTitle: string) {
  try {
    // Assuming the title is generated based on the last message or another logic
    const response = await fetch("http://localhost:4000/llms/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, modelType: modelTitle }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data.title;
  } catch (error) {
    console.error(error);
  }
}

// Creating Log
export async function createLogItem(logData: LogData) {
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create chatlog on server side: ", error);
  }
}

// Reading: Fetch all lofgs by as userID:
export async function fetchAllLogs() {
  try {
    const response = await fetch("http://localhost:4000/chatLogs", {
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Response Error  fetching chat Logs");
      return [];
    }
    const logs = await response.json();
    return logs;
  } catch (error) {
    console.error("Failed to fetch logs: ", error);
    return []; // serialiazable fallback
  }
}

export async function fetchLogById(logId: string) {
  try {
    const response = await fetch(`http://localhost:4000/chatLogs/${logId}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const log = await response.json();
    return log;
  } catch (error) {
    console.error("Failed to fetch log by id: ", error);
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
export async function updateLogItem(logData: UpdateLogData) {
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update chatlog on server side: ", error);
  }
}

// delete Log
export async function deleteLogItem({ logId }: { logId: string }) {
  try {
    const response = await fetch(`http://localhost:4000/chatLogs/${logId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Error: ", response.status);
      throw new Error("Failed to reach server when deleting log: " + response);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error: ", error);
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
    console.error("Failed to update log title: ", error);
    throw error;
  }
}
