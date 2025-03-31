export type MessageObjType = {
  id: string; // the unique id for the single message
  sender: "bot" | "user";
  text: string; // The text associated with the message
  urlPhoto?: string; // Bot only (The url photo corresponding to the message)
  userReaction: "like" | "dislike" | null;
  thinkingState?: boolean;
  toolUsage?: string;
};

export type MessageByChatIdType = {
  [chatId: string]: {
    content: MessageObjType[];
    assistantMongoId: string;
  };
};
// Important:
export interface MessageSliceType {
  currentChatId: string | null; // The log Id associated with the chat
  msg: string; // The current message being typed
  isNewChat: boolean; // If its a new chat or not
  messagesByChatId: MessageByChatIdType;
  loading: {
    [chatId: string]: boolean;
  };
  error: string | null; // The error for the chat message
}
