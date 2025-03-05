import { environment } from "../../..";
import {
  getProfessorRatings,
  getProfessorsByCourseIds,
} from "../../../db/models/professorRatings/professorRatingServices";
import { searchProfessors } from "../../qdrant/qdrantQuery";
import { ProfessorRatingsObject } from "./professorRatingsAssistant";

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
    } else if (object.type === "professor" && object.professors) {
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
  professors: string[],
  courseIds: string[] | undefined,
  messageToAdd: string
): Promise<string> {
  // Fetch professors from MongoDB "professors"
  try {
    const professorIds: string[] = [];
    try {
      for (const professor of professors) {
        const professorId = await searchProfessors(professor, 1);
        professorIds.push(professorId);
      }
    } catch (error) {
      if (environment === "dev") {
        console.error("Error fetching professors: ", error);
      }
      return messageToAdd + `\nError fetching professors: ${error}`;
    }
    const professorRatings = await getProfessorRatings(professorIds, courseIds);
    messageToAdd += `\nProfessor Ratings: ${JSON.stringify(professorRatings)}`;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching professors: ", error);
    }
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
    if (environment === "dev") {
      console.error("Error fetching courses: ", error);
    }
    return messageToAdd + `\nError fetching courses: ${error}`;
  }
  return messageToAdd;
}

export default professorRatings;
