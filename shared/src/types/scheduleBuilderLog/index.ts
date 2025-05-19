import { ScheduleResponse } from "../schedule";

import { CourseTerm, SelectedSection } from "../selectedSection";

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
  term: CourseTerm;
  suggestedSections: SelectedSection[];
  potentialSections: number[];
  user_query: string;
  currentSchedule: ScheduleResponse;
  diff: { added: number[]; removed: number[] };
  preferences: { with_time_conflicts: boolean };
  messages?: string[];
};

export type ScheduleBuilderMessage = {
  msg_id: string;
  role: "user" | "assistant" | "tool";
  msg: string;
  reaction: "like" | "dislike" | null;
  // Client-only field
  isPending?: boolean;
  // assistant-only fields
  tool_calls?: ToolCall[];
  tool_call_chunks?: string[];
  toolMessages?: { msg_id: string; msg: string }[];
  token_usage?: TokenUsage;
  response_time: number;
  finish_reason?: string;
  model_name?: string;
  system_fingerprint?: string;
};

// A conversation turn represents a single request-response cycle
export type ConversationTurn = {
  turn_id: string;
  timestamp: Date | string;
  clientTimestamp?: string; // client timestamp
  messages: ScheduleBuilderMessage[];
  token_usage: TokenUsage;
  state: ScheduleBuilderState;
};

export type ScheduleBuilderLog = {
  thread_id: string;
  conversation_turns: ConversationTurn[];
  updatedAt: Date;
  title: string;
  total_token_usage: TokenUsage;
  user_id: string;
};

// FetchedScheduleBuilderLog
export type FetchedScheduleBuilderLogListItem = {
  thread_id: string;
  updatedAt: Date | string;
  title: string;
};

export type FetchedScheduleBuilderLog = {
  thread_id: string;
  conversation_turns: ConversationTurn[];
  title: string;
};

export type ScheduleBuilderResponse = {
  assistant: string;
  conversation: string[];
  isNewSchedule: boolean;
  isNewThread: boolean;
  scheduleId: string;
  threadId: string;
  state: ScheduleBuilderState;
  schedule: ScheduleResponse;
};
