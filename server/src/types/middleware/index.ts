import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

export type AuthenticatedRequest = Request & {
  user: DecodedIdToken;
};
