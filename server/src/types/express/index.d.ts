// src/types/express.d.ts
import { DecodedIdToken } from "firebase-admin/auth";
import { UserType } from "@polylink/shared/types";

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedIdToken & { role?: UserType };
    file?: Express.Multer.File;
  }
}
interface CustomRequest extends Request {
  query: {
    subject?: string;
    courseId?: string;
    status?: string;
    days?: string;
    timeRange?: string;
    instructorRating?: string;
    units?: string;
    courseAttribute?: string;
    instructionMode?: string;
    instructor?: string;
  };
}
