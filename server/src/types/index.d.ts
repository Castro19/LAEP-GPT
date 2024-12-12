// src/types/express.d.ts
import { DecodedIdToken } from "firebase-admin/auth";
import { UserType } from "@polylink/shared/types";

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedIdToken & { role?: UserType };
    file?: Express.Multer.File;
  }
}
