import {
  FetchedScheduleBuilderLog,
  FetchedScheduleBuilderLogListItem,
  ScheduleBuilderMessage,
  ScheduleBuilderResponse,
  ScheduleBuilderState,
  ScheduleResponse,
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

    return {
      assistant: data.assistant,
      conversation: data.conversation,
      isNewSchedule: data.isNewSchedule,
      isNewThread: data.isNewThread,
      scheduleId: data.scheduleId,
      threadId: data.threadId,
      state: data.state,
      schedule: data.schedule,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to send schedule builder request:", error);
    }
    throw error;
  }
}

type OnChunk = (text: string) => void;
type OnDonePayload = {
  conversation: ScheduleBuilderMessage[];
  isNewSchedule: boolean;
  isNewThread: boolean;
  schedule_id: string;
  threadId: string;
  state: ScheduleBuilderState;
  schedule: ScheduleResponse;
};
type OnDone = (payload: OnDonePayload) => void;

export async function streamScheduleBuilderRequest(
  {
    threadId,
    userMsg,
    state,
  }: {
    threadId: string;
    userMsg: string;
    state: ScheduleBuilderState;
  },
  onChunk: OnChunk,
  onDone: OnDone
): Promise<void> {
  const response = await fetch(`${serverUrl}/scheduleBuilder/respond`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId, userMsg, state }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // split into SSE frames (delimited by \n\n)
    const parts = buffer.split("\n\n");
    buffer = parts.pop()!; // remainder

    for (const part of parts) {
      console.log("part", part);
      // e.g. "event: assistant\ndata: {\"text\":\"foo\"}"
      const lines = part.split("\n").map((l) => l.trim());
      const eventLine = lines.find((l) => l.startsWith("event:"));
      const dataLine = lines.find((l) => l.startsWith("data:"));
      if (!dataLine) continue;

      const raw = dataLine.slice("data:".length).trim();
      if (eventLine === "event: assistant") {
        const { text } = JSON.parse(raw);
        console.log("text", text);
        onChunk(text);
      } else if (eventLine === "event: done") {
        const payload: OnDonePayload = JSON.parse(raw);
        onDone(payload);
      }
      // you could also handle “error” events here
    }
  }
}
