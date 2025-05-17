import { StateAnnotation, stateModifier } from "./state";
import { fetchSections, manageSchedule } from "./tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { CourseTerm } from "@polylink/shared/types";
import { Response } from "express";
import { nanoid } from "nanoid";

/*───────────────────────────────────────────────────────────────────────*/
/* 1.  AI Agent                                                       */
/*───────────────────────────────────────────────────────────────────────*/

const agent = createReactAgent({
  llm: new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 }),
  tools: [fetchSections, manageSchedule],
  stateSchema: StateAnnotation,
  stateModifier: (state: any) =>
    stateModifier(state) as unknown as BaseMessage[],
});

/*───────────────────────────────────────────────────────────────────────*/
/* 2.  Public helpers                                                   */
/*───────────────────────────────────────────────────────────────────────*/
export async function* scheduleBuilderStream(
  initState: typeof StateAnnotation.State,
  threadId: string
): AsyncGenerator<{
  chunk?: string;
  toolCalls?: {
    id: string;
    name: string;
    args: any;
    type: string;
  }[];
  lastState?: typeof StateAnnotation.State;
}> {
  const stream = await agent.stream(initState, {
    configurable: { thread_id: threadId },
    recursionLimit: 10,
    streamMode: "values",
  });

  let prevLength = 0;
  let lastChunk: typeof StateAnnotation.State | undefined;

  for await (const step of stream) {
    const currentMessage = step.messages[step.messages.length - 1];
    console.log("Current message: ", currentMessage);

    lastChunk = step as typeof StateAnnotation.State;

    if (currentMessage instanceof AIMessage) {
      // 1) if there are tool calls, yield them immediately
      if (
        Array.isArray(currentMessage.tool_calls) &&
        currentMessage.tool_calls.length > 0
      ) {
        yield {
          toolCalls: currentMessage.tool_calls.map((tool) => ({
            id: tool.id || nanoid(), // Ensure we always have an ID
            name: tool.name,
            args: tool.args,
            type: "tool_call",
          })),
        };
      }

      // 2) then if there's new assistant text, yield that too
      if (typeof currentMessage.content === "string") {
        const newText = currentMessage.content.slice(prevLength);
        prevLength = currentMessage.content.length;
        if (newText) {
          yield { chunk: newText };
        }
      }
    }
  }

  if (!lastChunk) {
    throw new Error("No state was generated during the stream");
  }

  // finally send the last state so the caller knows we're done
  yield { lastState: lastChunk };
}

export type ScheduleBuilderParams = {
  userId: string;
  term: CourseTerm;
  scheduleId: string;
  preferences: { withTimeConflicts: boolean };
  threadId: string;
  userMsg: string;
  res: Response;
};
