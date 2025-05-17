import { AgentState } from "@langchain/langgraph/prebuilt";

export interface State extends AgentState {
  user_id: string;
  term: string;
  user_query: string;
  schedule_id: string;
  diff: { added: number[]; removed: number[] };
  preferences: Record<string, unknown>;
}
