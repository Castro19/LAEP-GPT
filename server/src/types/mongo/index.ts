import { Filter } from "mongodb";

export type MongoQuery<T> = Filter<T>;
