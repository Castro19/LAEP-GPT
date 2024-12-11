import { getDb } from "../../connection";
import { Collection } from "mongodb";
import {
  MongoQuery,
  ProfessorRatingDocument,
  ProfessRatingList,
} from "@polylink/shared/types";
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
  query: MongoQuery<ProfessorRatingDocument>
): Promise<ProfessRatingList[]> => {
  if (!professorRatingCollection) initializeCollection();

  try {
    const result = await professorRatingCollection
      .find(query)
      .project(PROJECTION)
      .toArray();
    return result as ProfessRatingList[];
  } catch (error: unknown) {
    if (environment === "dev") {
      console.error("Error viewing professor ratings: ", error);
    }
    return [];
  }
};
