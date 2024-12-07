// Server MongoDB Document
export type MessageAnalyticsDocument = {
  _id: string;
  userId: string; // client no, server yes
  userMessageId: string;
  botMessageId: string;
  logId: string;
  assistantId: string;
  hadFile: boolean;
  createdAt: Date;
  //   The rest added after completion
  completionCost: number;
  completionTokens: number;
  totalCost: number;
  totalTokens: number;
  errorMessage: string | null;
  finishedAt: Date;
  hadError: boolean;
  responseTime: number;
  userMessage: string | null;
  userReaction: "like" | "dislike" | null;
};

export type MessageAnalyticsUpdate = {
  userMessage: string | null;
  responseTime: number;
  finishedAt: Date;
  hadError: boolean;
  errorMessage: string | null;
};

export type MessageAnalyticsTokenAnalytics = {
  modelType: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptCost: string;
  completionCost: string;
  totalCost: string;
};

// Shared Client and Server
export type MessageAnalyticsCreate = {
  _id?: string; // needed for server only
  userId: string;
  userMessageId: string;
  botMessageId: string;
  logId: string;
  assistantId: string;
  hadFile: boolean;
  createdAt: Date | number;
};

// Shared Client and Server
export type MessageAnalyticsReaction = {
  botMessageId: string;
  userReaction: "like" | "dislike" | null;
};

// TO-DO: Look at the different variations of the document types for messageAnalytics. Such as hadError, each updated state, and create types for these that could be the document
