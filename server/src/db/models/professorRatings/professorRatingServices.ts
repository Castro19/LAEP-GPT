import {
  ProfessorRatingDocument,
  ProfessRatingList,
} from "@polylink/shared/types";
import { MongoQuery } from "../../../types/mongo";
import * as professorRatingCollection from "./professorRatingCollection";
import { sortAndLimitReviews } from "./professorRatingUtil";

export const getProfessorRatings = async (
  professorIds: string[],
  courseIds?: string[]
): Promise<ProfessRatingList[]> => {
  const query: MongoQuery<ProfessorRatingDocument> = {
    id: {},
  };

  if (professorIds) {
    query.id = { $in: professorIds };
  }
  try {
    const result = await professorRatingCollection.viewProfessorRatings(query);
    if (result.length === 0) {
      throw new Error("No professor ratings found");
    }

    // Filter and sort reviews for the specified courses, with a fallback to all reviews
    const filteredResult = sortAndLimitReviews(result, courseIds);
    return filteredResult;
  } catch (error) {
    throw new Error(
      "Error fetching professor ratings: " + (error as Error).message
    );
  }
};

export const getProfessorsByCourseIds = async (
  courseIds: string[]
): Promise<ProfessRatingList[]> => {
  const query: MongoQuery<ProfessorRatingDocument> = {
    courses: {},
  };

  if (courseIds && courseIds.length > 0) {
    query.courses = { $in: courseIds };
  }
  try {
    const result = await professorRatingCollection.viewProfessorRatings(query);

    if (result.length === 0) {
      throw new Error("No professors found");
    }
    // Filter and sort reviews for the specified courses, with a fallback to all reviews
    const filteredResult = sortAndLimitReviews(result, courseIds);

    return filteredResult;
  } catch (error) {
    throw new Error(
      "Error fetching professors by course IDs: " + (error as Error).message
    );
  }
};
