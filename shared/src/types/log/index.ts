import { MessageObjType } from "../message";

export type ChatLogDocument = LogData & {
  _id?: string;
  userId: string;
};

export type LogData = {
  assistantId?: string; // The assistantId from the assistant that the user is chatting with
  content: MessageObjType[]; // The message content from the log
  logId: string; // The unique id associated with the chat log
  timestamp: string; // The timee the last message was sent on that chatLog
  title?: string; // The title of the log
};

export type LogListType = {
  logId: string;
  title: string | undefined;
  timestamp: string;
};

export type LogSliceType = {
  deletingLogIds: string[]; // The list of logIds that are being deleted
  logList: LogListType[]; // The list of logs associated with the current User
};

export type CreateLogTitleData = {
  message: string;
  logId: string;
  title: string;
};

// TODO: Migrate to follow RESTful API Practices by updating entire document for PUT requests or using PATCH requests
