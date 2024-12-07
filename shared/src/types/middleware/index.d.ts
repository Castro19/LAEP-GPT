import { DecodedIdToken } from "firebase-admin/auth";
import { UserType } from "../auth";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken & { role?: UserType };
    }
  }
}
