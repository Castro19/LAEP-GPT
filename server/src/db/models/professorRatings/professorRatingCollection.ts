import { getDb } from "../../connection";
import { Collection } from "mongodb";
import {
  ProfessorRatingDocument,
  ProfessRatingList,
} from "@polylink/shared/types";
import { MongoQuery } from "../../../types/mongo";
import { environment } from "../../../index";

let professorRatingCollection: Collection<ProfessorRatingDocument>;

const initializeCollection = (): void => {
  professorRatingCollection = getDb().collection("professorRatings");
};

const PROJECTION = {
  _id: 0,
  id: 1,
  firstName: 1,
  lastName: 1,
  numEvals: 1,
  overallRating: 1,
  materialClear: 1,
  studentDifficulties: 3,
  courses: 1,
  tags: 1,
  reviews: 1,
};
// Read an individual professor rating
export const viewProfessorRatings = async (
  query: MongoQuery<ProfessorRatingDocument>,
  projection?: Partial<ProfessorRatingDocument>
): Promise<ProfessRatingList[]> => {
  if (!professorRatingCollection) initializeCollection();

  try {
    const result = await professorRatingCollection
      .find(query)
      // Ensure _id is never included in the projection
      .project(projection ? { _id: 0, ...projection } : PROJECTION)
      .toArray();
    return result as ProfessRatingList[];
  } catch (error: unknown) {
    if (environment === "dev") {
      console.error("Error viewing professor ratings: ", error);
    }
    return [];
  }
};

export const viewProfessorsbyProjection = async (
  query: MongoQuery<ProfessorRatingDocument>,
  projection: {
    [key: string]: 1;
  },
  limit?: number
): Promise<Partial<ProfessorRatingDocument>[]> => {
  if (!professorRatingCollection) initializeCollection();

  try {
    const result = await professorRatingCollection
      .find(query)
      .project(projection)
      .limit(limit ?? 10)
      .toArray();
    return result as Partial<ProfessorRatingDocument>[];
  } catch (error: unknown) {
    if (environment === "dev") {
      console.error("Error viewing professors by projection: ", error);
    }
    return [];
  }
};
