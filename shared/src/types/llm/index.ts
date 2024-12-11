export type RespondRequestBody = {
  message: string;
  chatId?: string;
  userId?: string;
  userMessageId: string;
  currentModel: string;
};

export type CancelRequestBody = {
  userMessageId: string;
};

export type TitleRequestBody = {
  message: string;
};

export type RunningStreamData = Record<
  string,
  {
    canceled: boolean;
    runId: string | null;
    threadId: string | null;
  }
>;
