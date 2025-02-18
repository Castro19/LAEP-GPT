import {
  getProfessorRatings,
  getProfessorsByCourseIds,
} from "../../../db/models/professorRatings/professorRatingServices";
import { ProfessorRatingsObject } from "../multiAgent";

/**
 *
 * @param messageToAdd
 * @param jsonObject
 * @returns messageToAdd with professors or courses or both or fallback message
 */

// {
//     "type": "both" | "professor" | "courses" | "fallback",
//     "courses": string[] | undefined,
//     "professors": string[] | undefined,
//     "reason": string | undefined
//   }

async function professorRatings(
  messageToAdd: string,
  jsonObject: ProfessorRatingsObject[]
): Promise<string> {
  for (const object of jsonObject) {
    if (object.type === "courses" && object.courses) {
      messageToAdd += await fetchCourses(object.courses, messageToAdd);
    } else if (object.type === "professors" && object.professors) {
      messageToAdd += await fetchProfessors(
        object.professors,
        undefined,
        messageToAdd
      );
    } else if (object.type === "both" && object.courses && object.professors) {
      messageToAdd += await fetchProfessors(
        object.professors,
        object.courses,
        messageToAdd
      );
    } else {
      messageToAdd += `\n${object.reason}`;
    }
  }
  return messageToAdd;
}

async function fetchProfessors(
  professorIds: string[],
  courseIds: string[] | undefined,
  messageToAdd: string
): Promise<string> {
  // Fetch professors from MongoDB "professors"
  try {
    const professorRatings = await getProfessorRatings(professorIds, courseIds);
    messageToAdd += `\nProfessor Ratings: ${JSON.stringify(professorRatings)}`;
  } catch (error) {
    console.error("Error fetching professors: ", error);
    return messageToAdd + `\nError fetching professors: ${error}`;
  }
  return messageToAdd;
}

async function fetchCourses(
  courseArray: string[],
  messageToAdd: string
): Promise<string> {
  // Fetch courses from MongoDB "courses"
  try {
    const professorRatings = await getProfessorsByCourseIds(courseArray);
    messageToAdd += `\nProfessor Ratings: ${JSON.stringify(professorRatings)}`;
  } catch (error) {
    console.error("Error fetching courses: ", error);
    return messageToAdd + `\nError fetching courses: ${error}`;
  }
  return messageToAdd;
}

export default professorRatings;
