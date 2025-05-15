import {
  FetchedScheduleBuilderLog,
  FetchedScheduleBuilderLogListItem,
  ScheduleBuilderResponse,
  ScheduleBuilderState,
} from "@polylink/shared/types";
import { environment, serverUrl } from "@/helpers/getEnvironmentVars";

// Fetch all logs
export async function fetchAllLogsFromDB(): Promise<
  FetchedScheduleBuilderLogListItem[]
> {
  try {
    const response = await fetch(`${serverUrl}/scheduleBuilder/logs`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch logs");
    }

    return data.data;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to fetch logs:", error);
    }
    throw error;
  }
}

// Fetch log by thread ID
export async function fetchLogByThreadIdFromDB(
  threadId: string
): Promise<FetchedScheduleBuilderLog> {
  try {
    const response = await fetch(
      `${serverUrl}/scheduleBuilder/logs/${threadId}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch log");
    }

    return data.data;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to fetch log:", error);
    }
    throw error;
  }
}

// Delete log
export async function deleteLogFromDB(threadId: string): Promise<void> {
  try {
    const response = await fetch(
      `${serverUrl}/scheduleBuilder/logs/${threadId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to delete log");
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to delete log:", error);
    }
    throw error;
  }
}

export async function sendScheduleBuilderRequest({
  threadId,
  userMsg,
  state,
}: {
  threadId: string;
  userMsg: string;
  state: ScheduleBuilderState;
}): Promise<ScheduleBuilderResponse> {
  try {
    const response = await fetch(`${serverUrl}/scheduleBuilder/respond`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId,
        userMsg,
        state,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to send schedule builder request");
    }

    return data.data;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to send schedule builder request:", error);
    }
    throw error;
  }
}
