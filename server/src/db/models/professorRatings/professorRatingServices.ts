import {
  ProfessorRatingDocument,
  ProfessRatingList,
} from "@polylink/shared/types";
import { MongoQuery } from "../../../types/mongo";
import * as professorRatingCollection from "./professorRatingCollection";
import { sortAndLimitReviews } from "./professorRatingUtil";
import { environment } from "../../..";

export const getProfessorRatings = async (
  professorIds: string[],
  courseIds?: string[],
  projection?: Partial<ProfessorRatingDocument>
): Promise<Partial<ProfessorRatingDocument>[]> => {
  const query: MongoQuery<ProfessorRatingDocument> = {
    id: {},
  };
  if (environment === "dev") {
    console.log("PROJECTION: ", projection);
  }

  if (professorIds) {
    query.id = { $in: professorIds };
  }
  try {
    const result = await professorRatingCollection.viewProfessorRatings(
      query,
      projection
    );
    if (environment === "dev") {
      console.log("RESULT: ", result);
    }
    // Check if result is undefined or null
    if (!result) {
      throw new Error(
        "Failed to fetch professor ratings: result is undefined or null"
      );
    }

    if (result.length === 0) {
      throw new Error("No professor ratings found");
    }

    // Filter and sort reviews for the specified courses, with a fallback to all reviews
    if (projection && projection.reviews) {
      const filteredResult = sortAndLimitReviews(result, courseIds);
      if (environment === "dev") {
        console.log("FILTERED RESULT: ", filteredResult);
      }
      return filteredResult;
    }
    return result;
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
