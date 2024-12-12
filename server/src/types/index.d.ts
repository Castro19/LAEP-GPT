// src/types/express.d.ts
import { DecodedIdToken } from "firebase-admin/auth";
import { UserType } from "@polylink/shared/types";
import { Filter } from "mongodb";

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedIdToken & { role?: UserType };
    file?: Express.Multer.File;
  }
}

export type MongoQuery<T> = Filter<T>;
