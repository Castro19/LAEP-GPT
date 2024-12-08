export type MessageObjType = {
  id: string; // the unique id for the single message
  sender: "bot" | "user";
  text: string; // The text associated with the message
  model?: string; // User only (The assistant title they chose)
  urlPhoto?: string; // Bot only (The url photo corresponding to the message)
  userReaction: "like" | "dislike" | null;
  thinkingState?: boolean;
};

// Important:
export interface MessageSliceType {
  currentChatId: string | null; // The log Id associated with the chat
  msg: string; // The current message being typed
  isNewChat: boolean; // If its a new chat or not
  msgList: MessageObjType[]; // The entire list of messages associated with a chat log
  isLoading: boolean; // If the message is currently being streamed out
  error: string | null; // The error for the chat message
}
