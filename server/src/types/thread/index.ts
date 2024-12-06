import { ObjectId } from "mongodb";

export type ThreadData = {
  chatId: string;
  threadId: string;
  vectorStoreId: string;
};

export type MongoThreadData = ThreadData & {
  _id: string | ObjectId;
};
