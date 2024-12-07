import { MessageObjType } from "../message";
export type LogData = {
    id: string;
    logId: string;
    userId: string;
    title: string;
    timestamp: string;
    content: MessageObjType[];
};
export type LogSliceType = {
    logList: LogData[];
    deletingLogIds: string[];
};
export type MongoLogData = LogData & {
    _id: string;
};
export type LogListType = {
    id: string;
    title: string;
    timestamp: string;
};
