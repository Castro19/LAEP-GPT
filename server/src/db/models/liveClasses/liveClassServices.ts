// Store the course catalog data in MongoDB
import { environment } from "../../../index";
import * as liveClassCollection from "./liveClassCollection";
import { LiveClassDocument } from "@polylink/shared/types";

export const getLiveClass = async (
  courseId: string
): Promise<LiveClassDocument | null> => {
  try {
    return await liveClassCollection.findLiveClass(courseId);
  } catch (error) {
    if (environment === "dev") {
      console.error("Error searching flowinfo:", error);
    }
    return null;
  }
};

export const getLiveClasses = async (
  courseIds: string[]
): Promise<LiveClassDocument[]> => {
  try {
    return await liveClassCollection.findLiveClasses(courseIds);
  } catch (error) {
    if (environment === "dev") {
      console.error("Error searching flowinfo:", error);
    }
    return [];
  }
};
