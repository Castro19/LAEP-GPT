/* eslint-disable no-unused-vars */
import {
  FetchedScheduleBuilderLog,
  FetchedScheduleBuilderLogListItem,
  ScheduleBuilderMessage,
  ScheduleBuilderState,
  ScheduleResponse,
  SelectedSection,
  ToolCall,
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

type OnChunk = (text: string) => void;
type OnMessage = (msg: ScheduleBuilderMessage) => void;
type OnToolCall = (calls: ToolCall[]) => void;
type OnToolCallMsg = (toolChunk: string) => void;
type OnDonePayload = {
  isNewSchedule: boolean;
  isNewThread: boolean;
  schedule_id: string;
  threadId: string;
  state: ScheduleBuilderState;
  schedule: ScheduleResponse;
  selectedSections: SelectedSection[];
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
  onMessage: OnMessage,
  onToolCall: OnToolCall,
  onToolCallMsg: OnToolCallMsg,
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

    const parts = buffer.split("\n\n");
    buffer = parts.pop()!;

    for (const part of parts) {
      const lines = part.split("\n").map((l) => l.trim());
      const ev = lines
        .find((l) => l.startsWith("event:"))
        ?.slice(6)
        .trim();
      const raw = lines
        .find((l) => l.startsWith("data:"))
        ?.slice(5)
        .trim();
      if (!ev || !raw) continue;

      switch (ev) {
        case "tool_call":
          console.log("tool_call", raw);
          // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-explicit-any
          const toolCalls: ToolCall[] = JSON.parse(raw).map((call: any) => ({
            ...call,
            args:
              typeof call.args === "string" ? JSON.parse(call.args) : call.args,
          }));
          onToolCall(toolCalls);
          break;

        case "tool_call_msg":
          const { text: toolCallText } = JSON.parse(raw);
          console.log("Tool message:", toolCallText);
          onToolCallMsg(toolCallText);
          break;

        case "assistant":
          // eslint-disable-next-line no-case-declarations
          const { text: assistantText } = JSON.parse(raw);
          onChunk(assistantText);
          break;

        case "message":
          // eslint-disable-next-line no-case-declarations
          const msg: ScheduleBuilderMessage = JSON.parse(raw);
          onMessage(msg);
          break;

        case "done":
          // eslint-disable-next-line no-case-declarations
          const payload: OnDonePayload = JSON.parse(raw);
          onDone(payload);
          return; // done reading

        case "error":
          // eslint-disable-next-line no-case-declarations
          const { message } = JSON.parse(raw);
          throw new Error(message);
      }
    }
  }
}

export async function updateLogTitleFromDB(
  threadId: string,
  title: string
): Promise<void> {
  try {
    const response = await fetch(
      `${serverUrl}/scheduleBuilder/logs/${threadId}/title`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update log title");
    }
  } catch (error) {
    console.error("Error updating log title:", error);
    throw error;
  }
}
