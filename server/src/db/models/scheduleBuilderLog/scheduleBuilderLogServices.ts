import {
  ScheduleBuilderLog,
  ConversationTurn,
  FetchedScheduleBuilderLogListItem,
  FetchedScheduleBuilderLog,
} from "@polylink/shared/types";
import * as ScheduleBuilderLogModel from "./scheduleBuilderLogCollection";
import { environment } from "../../../index";

// Create
export const createLog = async (logData: ScheduleBuilderLog): Promise<void> => {
  try {
    const result = await ScheduleBuilderLogModel.addLog(logData);
    if (!result.acknowledged) {
      if (environment === "dev") {
        console.error("Service: Failed to create schedule builder log");
      }
      throw new Error("Failed to create schedule builder log");
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
): Promise<FetchedScheduleBuilderLog | null> => {
  try {
    const log = await ScheduleBuilderLogModel.fetchLogByThreadId(threadId);
    if (!log) {
      return null;
    }
    const fetchedLog: FetchedScheduleBuilderLog = {
      thread_id: log.thread_id,
      conversation_turns: log.conversation_turns,
      title: log.title,
    };
    return fetchedLog;
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
    return;
  } catch (error) {
    if (environment === "dev") {
      console.error("Service error in addConversationTurn:", error);
    }
    throw new Error("Service error: " + (error as Error).message);
  }
};

export const getAllLogs = async (): Promise<
  FetchedScheduleBuilderLogListItem[]
> => {
  try {
    const logs = await ScheduleBuilderLogModel.fetchAllLogs();

    return logs;
  } catch (error) {
    if (environment === "dev") {
      console.error("Service error in getAllLogs:", error);
    }
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Delete
export const deleteLog = async (threadId: string): Promise<void> => {
  try {
    const result = await ScheduleBuilderLogModel.deleteLog(threadId);
    if (!result.acknowledged) {
      if (environment === "dev") {
        console.error("Service: Failed to delete schedule builder log");
      }
      throw new Error("Failed to delete schedule builder log");
    }
    return;
  } catch (error) {
    if (environment === "dev") {
      console.error("Service error in deleteLog:", error);
    }
    throw new Error("Service error: " + (error as Error).message);
  }
};
