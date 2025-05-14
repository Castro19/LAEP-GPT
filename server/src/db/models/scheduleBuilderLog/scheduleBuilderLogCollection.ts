import { getDb } from "../../connection";
import {
  ScheduleBuilderLog,
  ConversationTurn,
  FetchedScheduleBuilderLogListItem,
} from "@polylink/shared/types";
import {
  Collection,
  DeleteResult,
  InsertOneResult,
  UpdateResult,
} from "mongodb";
import { environment } from "../../../index";

let scheduleBuilderLogCollection: Collection<ScheduleBuilderLog>;

// Function to initialize the collection
const initializeCollection: () => void = () => {
  scheduleBuilderLogCollection = getDb().collection("scheduleBuilderLogs");
  if (environment === "dev") {
    console.log("Schedule Builder Log collection initialized");
  }
};

// Create
export const addLog = async (
  logData: ScheduleBuilderLog
): Promise<InsertOneResult<ScheduleBuilderLog>> => {
  if (!scheduleBuilderLogCollection) initializeCollection();
  try {
    if (environment === "dev") {
      console.log("Creating new schedule builder log:", {
        thread_id: logData.thread_id,
        title: logData.title,
      });
    }
    const result = await scheduleBuilderLogCollection.insertOne(logData);
    if (environment === "dev") {
      console.log(
        "Successfully created schedule builder log:",
        result.insertedId
      );
    }
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error creating schedule builder log:", error);
    }
    throw new Error(
      "Error creating a new Schedule Builder Log: " + (error as Error).message
    );
  }
};

// Read
export const fetchLogByThreadId = async (
  threadId: string
): Promise<ScheduleBuilderLog | null> => {
  if (!scheduleBuilderLogCollection) initializeCollection();
  try {
    if (environment === "dev") {
      console.log("Fetching schedule builder log for thread:", threadId);
    }
    const log = await scheduleBuilderLogCollection.findOne({
      thread_id: threadId,
    });
    if (environment === "dev") {
      console.log("Found schedule builder log:", log ? "Yes" : "No");
    }
    return log;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching schedule builder log:", error);
    }
    throw new Error("Error fetching log: " + (error as Error).message);
  }
};

export const fetchAllLogs = async (): Promise<
  FetchedScheduleBuilderLogListItem[]
> => {
  if (!scheduleBuilderLogCollection) initializeCollection();
  try {
    if (environment === "dev") {
      console.log("Fetching all schedule builder logs");
    }

    const logs = await scheduleBuilderLogCollection
      .find({})
      .project({
        thread_id: 1,
        updatedAt: 1,
        title: 1,
        _id: 0,
      })
      .sort({ updatedAt: -1 }) // Sort by most recent first
      .toArray();

    if (environment === "dev") {
      console.log(`Found ${logs.length} schedule builder logs`);
    }

    return logs as FetchedScheduleBuilderLogListItem[];
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching all schedule builder logs:", error);
    }
    throw new Error("Error fetching logs: " + (error as Error).message);
  }
};

// Update
export const addConversationTurn = async (
  threadId: string,
  turn: ConversationTurn
): Promise<UpdateResult> => {
  if (!scheduleBuilderLogCollection) initializeCollection();
  try {
    if (environment === "dev") {
      console.log("Adding conversation turn:", {
        thread_id: threadId,
        turn_id: turn.turn_id,
        message_count: turn.messages.length,
      });
    }

    // Get the current log to update total token usage
    const currentLog = await scheduleBuilderLogCollection.findOne({
      thread_id: threadId,
    });
    if (!currentLog) {
      throw new Error("Log not found");
    }

    // Calculate new total token usage
    const newTotalTokenUsage = {
      prompt_tokens:
        (currentLog.total_token_usage.prompt_tokens || 0) +
        turn.token_usage.prompt_tokens,
      completion_tokens:
        (currentLog.total_token_usage.completion_tokens || 0) +
        turn.token_usage.completion_tokens,
      total_tokens:
        (currentLog.total_token_usage.total_tokens || 0) +
        turn.token_usage.total_tokens,
    };

    const result = await scheduleBuilderLogCollection.updateOne(
      { thread_id: threadId },
      {
        $push: { conversation_turns: turn },
        $set: {
          updatedAt: new Date(),
          total_token_usage: newTotalTokenUsage,
        },
      }
    );

    if (environment === "dev") {
      console.log("Update result:", {
        matched: result.matchedCount,
        modified: result.modifiedCount,
      });
    }
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error adding conversation turn:", error);
    }
    throw new Error(
      "Error adding conversation turn: " + (error as Error).message
    );
  }
};

// Delete
export const deleteLog = async (threadId: string): Promise<DeleteResult> => {
  if (!scheduleBuilderLogCollection) initializeCollection();
  try {
    if (environment === "dev") {
      console.log("Deleting schedule builder log for thread:", threadId);
    }
    const result = await scheduleBuilderLogCollection.deleteOne({
      thread_id: threadId,
    });
    if (environment === "dev") {
      console.log("Delete result:", {
        deleted: result.deletedCount,
      });
    }
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error deleting schedule builder log:", error);
    }
    throw new Error("Error deleting log: " + (error as Error).message);
  }
};
