export type ModelType = {
  id?: string; // The unique id for the assistant
  title: string; // The title of the assistant
  desc: string; // The description for the assistant
  urlPhoto?: string; // The optional photo url for the assistant
  instructions?: string; // The instructions stored in db for assistant
};

export type MessageObjType = {
  id: number; // the unique id for the single message
  sender: string; // Either `bot` or `user`
  text: string; // The text associated with the message
  model?: string; // User only (The assistant title they chose)
  urlPhoto?: string; // Bot only (The url photo corresponding to the message)
};

// Important:
export interface MessageSliceType {
  currentChatId: string | null; // The log Id associated with the chat
  isNewChat: boolean; // If its a new chat or not
  msgList: MessageObjType[]; // The entire list of messages associated with a chat log
  isLoading: boolean; // If the message is currently being streamed out
  error: string | null; // The error for the chat message
}
