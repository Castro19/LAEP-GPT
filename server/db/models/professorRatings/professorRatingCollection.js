import db from "../../connection.js";

const professorRatingCollection = db.collection("professorRatings");

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
export const viewProfessorRatings = async (query) => {
  try {
    const result = await professorRatingCollection
      .find(query)
      .project(PROJECTION)
      .toArray();
    return result;
  } catch (error) {
    return [];
  }
};
