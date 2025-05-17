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
import { run_chatbot } from "../helpers/assistants/scheduleBuilder/scheduleBuilderAgent";
import { createOrUpdateSchedule } from "../db/models/schedule/scheduleServices";
import {
  createLog,
  addConversationTurn,
} from "../db/models/scheduleBuilderLog/scheduleBuilderLogServices";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { environment } from "..";
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
    let isNewSchedule = false;
    let isNewThread = false;
    const userId = req.user?.uid;
    // check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }

    let { term, scheduleId, preferences, threadId, userMsg } = req.body;

    if (!scheduleId) {
      isNewSchedule = true;
      //   create new schedule
      const result = await createOrUpdateSchedule(
        userId,
        [],
        term,
        undefined,
        []
      );
      scheduleId = result.scheduleId;
    }

    if (!threadId) {
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

    if (!preferences) {
      preferences = { withTimeConflicts: true };
    }
    // run chatbot
    const result = await run_chatbot({
      userId,
      term,
      scheduleId,
      preferences,
      threadId,
      userMsg,
    });

    // Create a new conversation turn
    const messages: ScheduleBuilderMessage[] = result.conversation.map(
      (msg) => {
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
            schedule_id: scheduleId,
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
      }
    );

    // Calculate token usage for this turn
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

    // Create the conversation turn
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

    // Add the conversation turn to the log
    await addConversationTurn(threadId, turn);

    res.status(200).json({
      assistant: result.assistant,
      conversation: result.conversation,
      isNewSchedule,
      isNewThread,
      scheduleId,
      threadId,
    });
  })
);

export default router;
