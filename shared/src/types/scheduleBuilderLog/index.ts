import { SectionEssential } from "../section";
import { CourseTerm } from "../selectedSection";

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
  // assistant-only
  tokensUsage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  response_time: number;
};

export type ScheduleBuilderLog = {
  thread_id: string;
  messages: ScheduleBuilderMessage[];
  updatedAt: Date;
  title: string;
};
