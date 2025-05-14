import { SectionEssential } from "../section";
import { CourseTerm } from "../selectedSection";

export type ToolCall = {
  id: string;
  name: string;
  args: Record<string, any>;
  type: "tool_call";
};

export type TokenUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_tokens_details?: {
    cached_tokens: number;
    audio_tokens: number;
  };
  completion_tokens_details?: {
    reasoning_tokens: number;
    audio_tokens: number;
    accepted_prediction_tokens: number;
    rejected_prediction_tokens: number;
  };
};

export type ScheduleBuilderState = {
  user_id: string;
  term: CourseTerm;
  sections: SectionEssential[];
  user_query: string;
  schedule_id: string;
  diff: { added: number[]; removed: number[] };
  preferences: { with_time_conflicts: boolean };
  messages: string[];
};

export type ScheduleBuilderMessage = {
  msg_id: string;
  role: "user" | "assistant" | "tool";
  msg: string;
  state: ScheduleBuilderState;
  reaction: "like" | "dislike" | null;
  // assistant-only fields
  tool_calls?: ToolCall[];
  token_usage?: TokenUsage;
  response_time: number;
  finish_reason?: string;
  model_name?: string;
  system_fingerprint?: string;
};

// A conversation turn represents a single request-response cycle
export type ConversationTurn = {
  turn_id: string;
  timestamp: Date;
  messages: ScheduleBuilderMessage[];
  token_usage: TokenUsage;
};

export type ScheduleBuilderLog = {
  thread_id: string;
  conversation_turns: ConversationTurn[];
  updatedAt: Date;
  title: string;
  total_token_usage: TokenUsage;
};
