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
  user?: DecodedIdToken & { role?: UserType };
  query: {
    classNumber?: string;
    subject?: string;
    courseIds: string;
    status?: string;
    days?: string;
    timeRange?: string;
    minUnits?: string;
    maxUnits?: string;
    courseAttribute?: string;
    instructionMode?: string;
    instructors?: string[];
    minInstructorRating?: string;
    maxInstructorRating?: string;
    includeUnratedInstructors?: string;
    "techElectives.major"?: string;
    "techElectives.concentration"?: string;
    minCatalogNumber?: string;
    maxCatalogNumber?: string;
    isTechElective?: string;
    withNoConflicts?: string;
    page?: string;
  };
}
