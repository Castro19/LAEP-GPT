/* Create a Helper function that will take as input a flowchart termData
and return the following:
 - Required Courses: An array of objects that contain the courseId and courseCompletion. If courseCompleiton is false, then the object will also contain courseName and courseDescription.
 - The number of tech electives left to take
 - Whether the General Writing requirement is met
*/

import { Term } from "types";
import { getDb } from "../../db/connection.js";
import { Collection } from "mongodb";

let courseCollection: Collection;

const initializeCourseCollection = () => {
  courseCollection = getDb().collection("courses");
};

const flowchartHelper = async (termData: Term[], catalogYear: string) => {
  if (!courseCollection) initializeCourseCollection();
  const requiredCourses = [];
  let techElectivesLeft = 0;
  let generalWritingMet = false;
  let uscpMet = false;

  // Collect required courses and count technical electives left
  for (let term of termData) {
    for (let course of term.courses) {
      if (course.completed) {
        continue;
      }
      if (course.id && requiredCourses.length < 5) {
        requiredCourses.push(course);
      } else if (
        course.customId &&
        course.customId.includes("Technical Elective")
      ) {
        techElectivesLeft++;
      }
    }
  }

  // Extract course IDs
  const courseIds = requiredCourses.map((course) => course.id);

  // Fetch course data from MongoDB
  const coursesFromDB = await courseCollection
    .find({
      courseId: { $in: courseIds },
      catalogYear: catalogYear,
    })
    .toArray();

  // Check if GWR requirement is met
  generalWritingMet = coursesFromDB.some((course) => course.gwrCourse === true);

  // Check if USCP requirement is met
  uscpMet = coursesFromDB.some((course) => course.uscpCourse === true);

  // Format required courses into a string
  const formattedRequiredCourses = requiredCourses
    .map((course) => {
      return `${course.id}: ${course.displayName} (${course.units})\n${course.desc}`;
    })
    .join("\n\n");

  console.log("requiredCourses: ", requiredCourses);
  console.log("techElectivesLeft: ", techElectivesLeft);
  console.log("generalWritingMet: ", generalWritingMet);
  console.log("uscpMet: ", uscpMet);
  console.log("Formatted Required Courses: ", formattedRequiredCourses);
  return {
    techElectivesLeft,
    generalWritingMet,
    uscpMet,
    formattedRequiredCourses,
  };
};

export default flowchartHelper;
