import { MessageObjType } from "../message/messageType";

export type AddLogParams = {
  msg: string;
  modelType: string;
  id: string;
  firebaseUserId: string | null;
};

export type UpdateLogData = {
  logId: string;
  firebaseUserId: string | null;
  urlPhoto?: string;
  content?: MessageObjType[];
  timestamp?: string;
};

export type LogData = {
  id: string;
  firebaseUserId?: string;
  title?: string;
  content: MessageObjType[];
  timestamp: string;
  urlPhoto?: string;
};

export type LogSliceType = {
  logList: LogData[];
};
