import { StateAnnotation, stateModifier } from "./state";
import { fetchSections, manageSchedule } from "./tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  AIMessage,
  ToolMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { CourseTerm } from "@polylink/shared/types";
import { environment } from "../../../index";
import { Response } from "express";

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
export const scheduleBuilderAgent = async (
  state: typeof StateAnnotation.State,
  threadId: string,
  res: Response
) => {
  let config = { configurable: { thread_id: threadId }, recursionLimit: 10 };
  let lastChunk: typeof StateAnnotation.State | undefined;

  // Create a new state with only the current message
  const currentState = {
    ...state,
    messages: [state.messages[state.messages.length - 1]], // Only use the last message
  };

  const stream = await agent.stream(
    currentState as typeof StateAnnotation.State,
    {
      ...config,
      streamMode: "values",
    }
  );

  let finalMsgs: BaseMessage[] = [];
  let i = 0;
  for await (const step of stream) {
    finalMsgs = step.messages;
    lastChunk = step as typeof StateAnnotation.State;
    if (environment === "dev") {
      console.log(
        `\n\n\n======step ${i}: ${JSON.stringify(step.messages, null, 2)}===========\n\n\n`
      );
    }
    i++;
  }

  if (!lastChunk) {
    throw new Error("No state was generated during the stream");
  }

  return { conversation: finalMsgs, state: lastChunk };
};

export async function* scheduleBuilderStream(
  initState: typeof StateAnnotation.State,
  threadId: string
): AsyncGenerator<{
  chunk?: string;
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
    lastChunk = step as typeof StateAnnotation.State;
    const aiMsg = step.messages.find(
      (m: BaseMessage) => m instanceof AIMessage
    ) as AIMessage;
    if (aiMsg?.content) {
      // only send the *new* bits
      const newText = aiMsg.content.slice(prevLength);
      prevLength = aiMsg.content.length;
      yield { chunk: newText as string };
    }
  }

  if (!lastChunk) {
    throw new Error("No state was generated during the stream");
  }

  // once complete, send a final “lastState” marker
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

export const run_chatbot = async ({
  userId,
  term,
  scheduleId,
  preferences,
  threadId,
  userMsg,
  res,
}: ScheduleBuilderParams) => {
  const initState: typeof StateAnnotation.State = {
    user_id: userId,
    term: term,
    schedule_id: scheduleId,
    diff: { added: [], removed: [] },
    preferences: { with_time_conflicts: preferences.withTimeConflicts },
    messages: [new HumanMessage({ content: userMsg })],
    sections: [],
    user_query: "",
  };

  const { conversation, state } = await scheduleBuilderAgent(
    initState,
    threadId,
    res
  );
  const last = conversation[conversation.length - 1] as AIMessage | ToolMessage;

  return { assistant: last.content, conversation, state };
};
