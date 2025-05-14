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
import { MemorySaver } from "@langchain/langgraph";

const memory = new MemorySaver();

/*───────────────────────────────────────────────────────────────────────*/
/* 1.  AI Agent                                                       */
/*───────────────────────────────────────────────────────────────────────*/

const agent = createReactAgent({
  llm: new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 }),
  tools: [fetchSections, manageSchedule],
  stateSchema: StateAnnotation,
  stateModifier: (state: any) =>
    stateModifier(state) as unknown as BaseMessage[],
  checkpointSaver: memory,
});
/*───────────────────────────────────────────────────────────────────────*/
/* 2.  Public helpers                                                   */
/*───────────────────────────────────────────────────────────────────────*/
export const scheduleBuilderAgent = async (
  state: typeof StateAnnotation.State,
  threadId: string
) => {
  let config = { configurable: { thread_id: threadId }, recursionLimit: 10 };

  // State already contains the user's messages; no extra SystemMessage needed
  const stream = await agent.stream(state as typeof StateAnnotation.State, {
    ...config,
    streamMode: "values",
  });

  let finalMsgs: BaseMessage[] = [];
  for await (const step of stream) {
    finalMsgs = step.messages;
    console.log("Final messages:", step.messages);
  }
  return finalMsgs;
};

export type ScheduleBuilderParams = {
  userId: string;
  term: CourseTerm;
  scheduleId: string;
  preferences: { withTimeConflicts: boolean };
  threadId: string;
  userMsg: string;
};
export const run_chatbot = async ({
  userId,
  term,
  scheduleId,
  preferences,
  threadId,
  userMsg,
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

  const convo = await scheduleBuilderAgent(initState, threadId);
  const last = convo[convo.length - 1] as AIMessage | ToolMessage;

  return { assistant: last.content, conversation: convo };
};
