import { getDb } from "../../connection";
import { Collection } from "mongodb";
import { MongoQuery } from "../../../types/mongo";
type InstructorDocument = {
  name: string;
  $id: string;
};

let instructorCollection: Collection<InstructorDocument>;

const initializeCollection = (): void => {
  instructorCollection = getDb().collection("instructor");
};

export const findAllInstructors = async (
  query: MongoQuery<InstructorDocument>[]
): Promise<string[]> => {
  if (!instructorCollection) initializeCollection();
  const instructors = await instructorCollection
    .find(query)
    .limit(25)
    .toArray();
  const instructorNames = instructors.map((instructor) => instructor.name);
  return instructorNames;
};
