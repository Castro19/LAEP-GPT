import * as professorRatingCollection from "./professorRatingCollection.js";
import { sortAndLimitReviews } from "./professorRatingUtil.js";

export const getProfessorRatings = async (professorIds, courseIds) => {
  let query = {};

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
    throw new Error("Error fetching professor ratings: " + error.message);
  }
};

export const getProfessorsByCourseIds = async (courseIds) => {
  let query = {};

  if (courseIds) {
    query.courses = { $in: courseIds };
  }
  try {
    const result = await professorRatingCollection.viewProfessorRatings(query);
    console.log("result: ", result);
    if (result.length === 0) {
      throw new Error("No professors found");
    }
    // Filter and sort reviews for the specified courses, with a fallback to all reviews
    const filteredResult = sortAndLimitReviews(result, courseIds);

    return filteredResult;
  } catch (error) {
    throw new Error(
      "Error fetching professors by course IDs: " + error.message
    );
  }
};
