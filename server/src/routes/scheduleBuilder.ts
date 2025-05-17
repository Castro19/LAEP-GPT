import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import asyncHandler from "../middlewares/asyncMiddleware";
import {
  RunningStreamData,
  ScheduleBuilderMessage,
  ConversationTurn,
} from "@polylink/shared/types";
import { isUnauthorized } from "../helpers/auth/verifyAuth";
import { v4 as uuidv4 } from "uuid";
import { scheduleBuilderStream } from "../helpers/assistants/scheduleBuilder/scheduleBuilderAgent";
import {
  createOrUpdateSchedule,
  getScheduleById,
} from "../db/models/schedule/scheduleServices";
import {
  createLog,
  addConversationTurn,
  getAllLogs,
  getLogByThreadId,
} from "../db/models/scheduleBuilderLog/scheduleBuilderLogServices";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { environment } from "..";
import { StateAnnotation } from "../helpers/assistants/scheduleBuilder/state";
const router = express.Router();

// Rate limiter for GPT messages
const messageRateLimiter = rateLimit({
  windowMs: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
  max: 10000, // FIxing Rate limit later
  message:
    "You have exceeded the message limit of 25 messages per 3 hours. Please try again later.",
  headers: true,
  keyGenerator: (req) => req.body.userId || "unknown-user",
});

// Store running streams: Useful for cancelling a running stream
const runningStreams: RunningStreamData = {};

router.post(
  "/respond",
  messageRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    // 0.) Check if user is authorized
    const userId = req.user?.uid;
    // check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }

    // 1) switch to SSE / chunked
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    // 2) Initialize variables
    let isNewSchedule = false;
    let isNewThread = false;
    let { state, threadId, userMsg } = req.body;
    let { term, schedule_id, preferences } = state;

    // 3) Check if schedule exists and create if not
    if (!schedule_id) {
      isNewSchedule = true;
      //   create new schedule
      const result = await createOrUpdateSchedule(
        userId,
        [],
        term,
        undefined,
        []
      );
      schedule_id = result.scheduleId;
    }

    // 4) Check if thread exists and create if not
    if (threadId.includes("temp")) {
      isNewThread = true;
      //   create new thread
      threadId = uuidv4();
      //   create a new document in the scheduleBuilderLogs collection
      await createLog({
        thread_id: threadId,
        conversation_turns: [],
        updatedAt: new Date(),
        title: "New Schedule Builder Session",
        total_token_usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
      });
      if (environment === "dev") {
        console.log("New thread created:", threadId);
      }
    }

    // 5) Check if preferences are set and set defaults if not
    if (!preferences) {
      preferences = { withTimeConflicts: true };
    }

    // 6) Run chatbot
    let lastState;
    const initState: typeof StateAnnotation.State = {
      ...state,
      user_id: userId,
      term: term,
      schedule_id: schedule_id,
      preferences: { with_time_conflicts: preferences.withTimeConflicts },
      messages: [new HumanMessage({ content: userMsg })],
    };
    try {
      for await (const { chunk, lastState: s } of scheduleBuilderStream(
        initState,
        threadId
      )) {
        if (chunk) {
          res.write(`data: ${JSON.stringify({ assistantChunk: chunk })}\n\n`);
        }
        if (s) {
          lastState = s;
          break;
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.write(
        `event: error\ndata: ${JSON.stringify({ message: errorMessage })}\n\n`
      );
      res.end();
      return;
    }

    const conversation = lastState!.messages;

    // 7) Create a new conversation turn
    const messages: ScheduleBuilderMessage[] = conversation.map((msg) => {
      const baseMessage: Partial<ScheduleBuilderMessage> = {
        msg_id: msg.id || uuidv4(),
        role:
          msg instanceof HumanMessage
            ? "user"
            : msg instanceof AIMessage
              ? "assistant"
              : "tool",
        msg:
          typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content),
        state: {
          user_id: userId,
          term,
          sections: [],
          user_query: userMsg,
          schedule_id: schedule_id,
          diff: { added: [], removed: [] },
          preferences: { with_time_conflicts: preferences.withTimeConflicts },
          messages: [],
        },
        reaction: null,
        response_time: 0,
      };

      if (msg instanceof AIMessage) {
        return {
          ...baseMessage,
          tool_calls: msg.tool_calls?.map((tool) => ({
            id: tool.id,
            name: tool.name,
            args: tool.args,
            type: "tool_call",
          })),
          token_usage: msg.response_metadata?.tokenUsage
            ? {
                prompt_tokens: msg.response_metadata.tokenUsage.promptTokens,
                completion_tokens:
                  msg.response_metadata.tokenUsage.completionTokens,
                total_tokens: msg.response_metadata.tokenUsage.totalTokens,
                prompt_tokens_details:
                  msg.response_metadata.usage?.prompt_tokens_details,
                completion_tokens_details:
                  msg.response_metadata.usage?.completion_tokens_details,
              }
            : undefined,
          finish_reason: msg.response_metadata?.finish_reason,
          model_name: msg.response_metadata?.model_name,
          system_fingerprint: msg.response_metadata?.system_fingerprint,
        } as ScheduleBuilderMessage;
      }

      if (msg instanceof HumanMessage) {
        return {
          ...baseMessage,
          tool_calls: undefined,
          token_usage: undefined,
        } as ScheduleBuilderMessage;
      }

      // ToolMessage
      return {
        ...baseMessage,
        tool_calls: undefined,
        token_usage: undefined,
      } as ScheduleBuilderMessage;
    });

    // 8) Calculate token usage for this turn
    const turnTokenUsage = messages.reduce(
      (acc, msg) => {
        if (msg.token_usage) {
          return {
            prompt_tokens:
              (acc.prompt_tokens || 0) + msg.token_usage.prompt_tokens,
            completion_tokens:
              (acc.completion_tokens || 0) + msg.token_usage.completion_tokens,
            total_tokens:
              (acc.total_tokens || 0) + msg.token_usage.total_tokens,
          };
        }
        return acc;
      },
      {} as {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      }
    );

    // 9) Create the conversation turn
    const turn: ConversationTurn = {
      turn_id: uuidv4(),
      timestamp: new Date(),
      messages,
      token_usage: {
        prompt_tokens: turnTokenUsage.prompt_tokens || 0,
        completion_tokens: turnTokenUsage.completion_tokens || 0,
        total_tokens: turnTokenUsage.total_tokens || 0,
      },
    };

    // 10) Add the conversation turn to the log
    await addConversationTurn(threadId, turn);

    // 11) return the response
    const schedule = await getScheduleById(userId, schedule_id);
    res.write(
      `event: done\n` +
        `data: ${JSON.stringify({
          conversation,
          isNewSchedule,
          isNewThread,
          schedule_id,
          threadId,
          state: lastState,
          schedule,
        })}\n\n`
    );
    res.end();
  })
);

// Get all schedule builder logs
router.get(
  "/logs",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.uid;

    // Check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }

    try {
      const logs = await getAllLogs();

      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch schedule builder logs",
        message: (error as Error).message,
      });
    }
  })
);

// Get a specific schedule builder log
router.get(
  "/logs/:threadId",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.uid;

    // Check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }

    const { threadId } = req.params;

    try {
      const log = await getLogByThreadId(threadId);

      res.status(200).json({
        success: true,
        data: log,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch schedule builder log",
        message: (error as Error).message,
      });
    }
  })
);

export default router;
