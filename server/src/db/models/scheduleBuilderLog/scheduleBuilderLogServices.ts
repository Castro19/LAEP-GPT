import {
  ScheduleBuilderLog,
  ScheduleBuilderMessage,
  ScheduleBuilderState,
  TokenUsage,
  ConversationTurn,
} from "@polylink/shared/types";
import * as ScheduleBuilderLogModel from "./scheduleBuilderLogCollection";
import { environment } from "../../../index";

// Create
export const createLog = async (logData: ScheduleBuilderLog): Promise<void> => {
  try {
    if (environment === "dev") {
      console.log("Service: Creating new schedule builder log");
    }
    const result = await ScheduleBuilderLogModel.addLog(logData);
    if (!result.acknowledged) {
      if (environment === "dev") {
        console.error("Service: Failed to create schedule builder log");
      }
      throw new Error("Failed to create schedule builder log");
    }
    if (environment === "dev") {
      console.log("Service: Successfully created schedule builder log");
    }
    return;
  } catch (error) {
    if (environment === "dev") {
      console.error("Service error in createLog:", error);
    }
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Read
export const getLogByThreadId = async (
  threadId: string
): Promise<ScheduleBuilderLog | null> => {
  try {
    if (environment === "dev") {
      console.log(
        "Service: Fetching schedule builder log for thread:",
        threadId
      );
    }
    const log = await ScheduleBuilderLogModel.fetchLogByThreadId(threadId);
    if (environment === "dev") {
      console.log("Service: Found schedule builder log:", log ? "Yes" : "No");
    }
    return log;
  } catch (error) {
    if (environment === "dev") {
      console.error("Service error in getLogByThreadId:", error);
    }
    throw new Error("Service error: " + (error as Error).message);
  }
};

export const addConversationTurn = async (
  threadId: string,
  turn: ConversationTurn
): Promise<void> => {
  try {
    if (environment === "dev") {
      console.log("Service: Adding conversation turn:", {
        threadId,
        turnId: turn.turn_id,
        messageCount: turn.messages.length,
      });
    }
    const result = await ScheduleBuilderLogModel.addConversationTurn(
      threadId,
      turn
    );
    if (!result.acknowledged) {
      if (environment === "dev") {
        console.error("Service: Failed to add conversation turn");
      }
      throw new Error("Failed to add conversation turn");
    }
    if (environment === "dev") {
      console.log("Service: Successfully added conversation turn");
    }
    return;
  } catch (error) {
    if (environment === "dev") {
      console.error("Service error in addConversationTurn:", error);
    }
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Delete
export const deleteLog = async (threadId: string): Promise<void> => {
  try {
    if (environment === "dev") {
      console.log(
        "Service: Deleting schedule builder log for thread:",
        threadId
      );
    }
    const result = await ScheduleBuilderLogModel.deleteLog(threadId);
    if (!result.acknowledged) {
      if (environment === "dev") {
        console.error("Service: Failed to delete schedule builder log");
      }
      throw new Error("Failed to delete schedule builder log");
    }
    if (environment === "dev") {
      console.log("Service: Successfully deleted schedule builder log");
    }
    return;
  } catch (error) {
    if (environment === "dev") {
      console.error("Service error in deleteLog:", error);
    }
    throw new Error("Service error: " + (error as Error).message);
  }
};
