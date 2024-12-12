import { DecodedIdToken } from "firebase-admin/auth";
import { UserType } from "@polylink/shared/types";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken & { role?: UserType };
      file?: Express.Multer.File;
    }
  }
}

export type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;
