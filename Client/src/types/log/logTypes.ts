import { MessageObjType } from "../message/messageType";

export type LogData = {
  id: string; // The unique id associated with the chat log
  firebaseUserId?: string; // The userId from the user who made the chat log
  title?: string; // The title of the log
  content: MessageObjType[]; // The message content from the log
  timestamp: string; // The timee the last message was sent on that chatLog
};

export type LogSliceType = {
  logList: LogData[]; // The list of logs associated with the current User
  deletingLogIds: string[]; // The list of logIds that are being deleted
};
