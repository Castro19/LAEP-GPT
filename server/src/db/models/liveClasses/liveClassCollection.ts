import { LiveClassDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection } from "mongodb";

let liveClassCollection: Collection<LiveClassDocument>;

const initializeCollection = (): void => {
  liveClassCollection = getDb().collection("Winter2025");
};

export const findLiveClass = async (
  courseId: string
): Promise<LiveClassDocument | null> => {
  if (!liveClassCollection) initializeCollection();
  const liveClass = await liveClassCollection.findOne({
    course_id: courseId,
  });
  if (!liveClass) {
    return null;
  }
  return liveClass as LiveClassDocument;
};

export const findLiveClasses = async (
  courseIds: string[]
): Promise<LiveClassDocument[]> => {
  if (!liveClassCollection) initializeCollection();
  const liveClasses = await liveClassCollection
    .find({
      course_id: { $in: courseIds },
    })
    .toArray();
  return liveClasses as LiveClassDocument[];
};
