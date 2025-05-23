import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import asyncHandler from "../middlewares/asyncMiddleware";
import {
  ScheduleBuilderMessage,
  ConversationTurn,
  ScheduleBuilderState,
  SelectedSection,
  CourseTerm,
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
  updateLogTitle,
  deleteLog,
} from "../db/models/scheduleBuilderLog/scheduleBuilderLogServices";
import {
  HumanMessage,
  AIMessageChunk,
  AIMessage,
} from "@langchain/core/messages";
import { StateAnnotation } from "../helpers/assistants/scheduleBuilder/state";
import { transformClassNumbersToSelectedSections } from "../db/models/schedule/transformSection";
import { environment } from "../index";
import { buildSectionSummaries } from "../helpers/assistants/scheduleBuilder/helpers";

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
    if (environment === "dev") {
      console.log("STATE FROM CLIENT REQ: ", state);
    }

    let { term, schedule_id, preferences } = state;
    // 3) Check if schedule exists and create if not
    if (!schedule_id) {
      isNewSchedule = true;
      //   create new schedule
      const result = await createOrUpdateSchedule(
        userId,
        state.currentSchedule.sections.map(
          (s: SelectedSection) => s.classNumber
        ),
        term,
        undefined,
        []
      );
      schedule_id = result.scheduleId;
    }

    // do checks to avoid tampering:
    // ensure message is not too long
    if (userMsg.length > 2000) {
      res.write(
        `event: error\ndata: ${JSON.stringify({ message: "Message too long" })}\n\n`
      );
      res.end();
      return;
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
        user_id: userId,
      });
    }

    // 5) Check if preferences are set and set defaults if not
    if (!preferences) {
      preferences = { withTimeConflicts: true };
    } else {
      preferences.withTimeConflicts = true;
    }

    const currentLog = await getLogByThreadId(threadId);
    const previousMessages = (currentLog?.conversation_turns ?? [])
      .map((turn) => turn.messages)
      .flat()
      .filter((msg) => msg.msg !== "" && msg.role === "assistant") // Only filter out empty messages
      .slice(-8) // Keep only the last 8 messages
      .map((msg) => ({
        role: msg.role,
        content: msg.msg,
      }));

    // 6) Run chatbot
    let lastState;
    const currentSchedule = await getScheduleById(userId, schedule_id);
    const initState: typeof StateAnnotation.State = {
      ...state,
      term: term,
      schedule_id: schedule_id,
      preferences: { withTimeConflicts: preferences.withTimeConflicts },
      user_query: userMsg,
      currentSchedule: currentSchedule,
      messages: [
        ...previousMessages.map((msg) =>
          msg.role === "assistant"
            ? new AIMessage({ content: msg.content })
            : new HumanMessage({ content: msg.content })
        ),
        new HumanMessage({ content: userMsg }),
      ],
      sectionSummaries: await buildSectionSummaries(
        currentSchedule?.sections ?? []
      ),
    };

    try {
      for await (const {
        chunk,
        lastState: s,
        toolChunk,
        toolCallChunk,
      } of scheduleBuilderStream(initState, threadId, userId)) {
        if (toolCallChunk) {
          res.write(
            `event: tool_call_chunk\ndata: ${JSON.stringify({ text: toolCallChunk })}\n\n`
          );
        }
        if (chunk) {
          res.write(
            `event: assistant\ndata: ${JSON.stringify({ text: chunk })}\n\n`
          );
        }
        if (toolChunk) {
          res.write(
            `event: tool_call_msg\ndata: ${JSON.stringify({ text: toolChunk })}\n\n`
          );
        }
        if (s) {
          lastState = s;
          break;
        }
      }
    } catch (error: unknown) {
      if (environment === "dev") {
        console.error("Error in schedule builder:", error);
      }
      res.write(
        `event: error\ndata: ${JSON.stringify({ message: "Unknown error occured. Try again" })}\n\n`
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
            : msg instanceof AIMessageChunk
              ? "assistant"
              : "tool",
        msg:
          typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content),
        reaction: null,
        response_time: 0,
      };

      if (msg instanceof AIMessageChunk) {
        // pull usage from the correct place
        const usageFromResponse = msg.response_metadata?.usage;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const usageFromLegacy = (msg as any).usage_metadata;

        const token_usage = usageFromResponse
          ? {
              prompt_tokens: usageFromResponse.prompt_tokens,
              completion_tokens: usageFromResponse.completion_tokens,
              total_tokens: usageFromResponse.total_tokens,
              prompt_tokens_details: usageFromResponse.prompt_tokens_details,
              completion_tokens_details:
                usageFromResponse.completion_tokens_details,
            }
          : usageFromLegacy
            ? {
                prompt_tokens: usageFromLegacy.input_tokens,
                completion_tokens: usageFromLegacy.output_tokens,
                total_tokens: usageFromLegacy.total_tokens,
                prompt_tokens_details: usageFromLegacy.input_token_details,
                completion_tokens_details: usageFromLegacy.output_token_details,
              }
            : undefined;

        return {
          ...baseMessage,
          tool_calls: msg.tool_calls?.map((tool) => ({
            id: tool.id || uuidv4(),
            name: tool.name,
            args: tool.args,
            type: "tool_call",
          })),
          token_usage,
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

    // // 7a) Stream out each message as its own SSE event
    // for (const msg of messages) {
    //   if (msg.role === "user") continue; // don't re-send the user's message
    //   res.write("event: message\n");
    //   res.write(`data: ${JSON.stringify(msg)}\n\n`);
    // }

    // 7b) Calculate token usage for this turn
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

    // Ensure there's always one assistant bubble while preserving token usage
    if (!messages.some((m) => m.role === "assistant")) {
      const last = messages[messages.length - 1];
      // Create a new assistant message that preserves the token usage
      const assistantMessage: ScheduleBuilderMessage = {
        ...last,
        role: "assistant",
        token_usage: last.token_usage, // Preserve the token usage
      };
      messages[messages.length - 1] = assistantMessage;
    }
    // 8) Create the conversation turn
    const turn: ConversationTurn = {
      turn_id: uuidv4(),
      timestamp: new Date(),
      messages,
      token_usage: {
        prompt_tokens: turnTokenUsage.prompt_tokens || 0,
        completion_tokens: turnTokenUsage.completion_tokens || 0,
        total_tokens: turnTokenUsage.total_tokens || 0,
      },
      state: lastState as unknown as ScheduleBuilderState,
    };

    // 9) Add the conversation turn to the log
    await addConversationTurn(threadId, turn);

    res.write(
      `event: done\n` +
        `data: ${JSON.stringify({
          isNewSchedule,
          isNewThread,
          schedule_id,
          threadId,
        })}\n\n`
    );

    // 10) Update the schedule
    await createOrUpdateSchedule(
      userId,
      lastState?.currentSchedule.sections.map(
        (s: SelectedSection) => s.classNumber
      ) ?? [],
      term,
      schedule_id,
      lastState?.currentSchedule.customEvents ?? []
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

// Update schedule builder log title
router.patch(
  "/logs/:threadId/title",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.uid;

    // Check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }

    const { threadId } = req.params;
    const { title } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        error: "Title is required",
      });
      return;
    }

    try {
      await updateLogTitle(threadId, title);

      res.status(200).json({
        success: true,
        message: "Log title updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to update schedule builder log title",
        message: (error as Error).message,
      });
    }
  })
);

// Delete a schedule builder log
router.delete(
  "/logs/:threadId",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.uid;

    // Check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }

    const { threadId } = req.params;

    try {
      await deleteLog(threadId);

      res.status(200).json({
        success: true,
        message: "Log deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to delete schedule builder log",
        message: (error as Error).message,
      });
    }
  })
);

router.get("/potential-sections/:term/:classNumbers", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { term, classNumbers } = req.params as {
      term: CourseTerm;
      classNumbers: string;
    };
    const classNumbersArray = classNumbers.split(",").map(Number);
    const selectedSections = await transformClassNumbersToSelectedSections(
      userId,
      classNumbersArray,
      term
    );

    return res.status(200).json({
      message: "Selected sections fetched successfully",
      selectedSections,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching selected sections:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
