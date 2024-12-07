export type MessageAnalytics = {
    userId: string;
    userMessageId: string;
    botMessageId: string;
    logId: string;
    assistantId: string;
    hadFile: boolean;
    createdAt: Date;
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
export type MessageAnalyticsCreate = {
    _id: string;
    userId: string;
    userMessageId: string;
    botMessageId: string;
    logId: string;
    assistantId: string;
    hadFile: boolean;
    createdAt: Date | number;
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
export type MessageAnalyticsReaction = {
    botMessageId: string;
    userReaction: "like" | "dislike" | null;
};
