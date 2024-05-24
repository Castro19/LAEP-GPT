import { MessageObjType } from "../message/messageType";

export type AddLogParams = {
  msg: string;
  modelType: string;
  urlPhoto: string;
  id: string;
  firebaseUserId: string;
};

export type UpdateLogData = {
  logId: string;
  firebaseUserId: string;
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
