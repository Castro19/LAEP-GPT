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
  state: typeof StateAnnotation.State
) => {
  // State already contains the user's messages; no extra SystemMessage needed
  const stream = await agent.stream(state as typeof StateAnnotation.State, {
    streamMode: "values",
  });

  let finalMsgs: BaseMessage[] = [];
  for await (const step of stream) finalMsgs = step.messages;
  return finalMsgs;
};

export const run_chatbot = async (userText: string, userId: string) => {
  const initState: typeof StateAnnotation.State = {
    user_id: userId,
    term: "spring2025",
    schedule_id: "d91c2e47-8682-410c-9e80-edcd5f7d3b9c",
    diff: { added: [], removed: [] },
    preferences: { with_time_conflicts: true },
    messages: [new HumanMessage({ content: userText })],
    sections: [],
    user_query: "",
  };

  const convo = await scheduleBuilderAgent(initState);
  const last = convo[convo.length - 1] as AIMessage | ToolMessage;

  return { assistant: last.content, conversation: convo };
};
