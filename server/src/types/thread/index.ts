import { ObjectId } from "mongodb";

export type ThreadData = {
  chatId: string;
  threadId: string;
  vectorStoreId: string;
};

export type ThreadDocument = {
  _id: ObjectId;
  threadId: string;
  vectorStoreId: string;
};
