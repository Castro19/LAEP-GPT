import { LogData, UpdateLogData } from "@/types";

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
export async function fetchAllLogs(userId: string) {
  try {
    const response = await fetch(`http://localhost:4000/chatLogs/${userId}`);
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

// Update Log (Message gets added)
export async function updateLogItem(logData: UpdateLogData) {
  try {
    const response = await fetch(`http://localhost:4000/chatLogs`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    console.log("UPDATED DATA: ", data);
    return data;
  } catch (error) {
    console.error("Failed to update chatlog on server side: ", error);
  }
}

// delete Log
export async function deleteLogItem({
  logId,
  userId,
}: {
  logId: string;
  userId: string;
}) {
  console.log("UID: ", userId);
  try {
    const response = await fetch(
      `http://localhost:4000/chatLogs/${userId}/${logId}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.log(`Error: ${errorData}`);
      throw new Error(
        "Failed to reach server when deleting log: " + errorData.message
      );
    }
    const responseData = await response.json();
    console.log("Response Data: ", responseData);
    return responseData;
  } catch (error) {
    console.log(`Error: `, error);
  }
}
