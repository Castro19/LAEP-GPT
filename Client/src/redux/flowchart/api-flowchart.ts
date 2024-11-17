import { fetchFlowchartData } from "./flowchartSlice";
import { AppDispatch } from "../store";
import { resetFlowchartData } from "./flowchartSlice";
import { Course, CourseCatalog, CourseSearch, Term } from "@/types";

/**
 * Helper function to fetch the flowchart data JSON based on user selections.
 * @param dispatch Redux dispatch function
 * @param catalog Selected catalog (e.g., "2022-2026")
 * @param major Selected major (e.g., "Computer Science")
 * @param concentration Selected concentration (e.g., "22-26.52CSCBSU")
 */
export async function fetchFlowchartDataHelper(
  dispatch: AppDispatch,
  catalog: string,
  major: string,
  concentration: string
) {
  // Construct the file path for the JSON file
  const filePath = `api/data/flows/json/dflows/${encodeURIComponent(catalog)}/${encodeURIComponent(
    major
  )}/${encodeURIComponent(concentration)}.json`;

  // Construct the full GitHub raw URL
  const fileUrl = `https://raw.githubusercontent.com/polyflowbuilder/polyflowbuilder/main/${filePath}`;

  const courseUrl = `https://raw.githubusercontent.com/polyflowbuilder/polyflowbuilder/refs/heads/main/api/data/courses/${catalog}/${catalog}.json`;

  try {
    // Reset the flowchart data before fetching new data
    dispatch(resetFlowchartData());

    // Fetch the JSON data from the constructed URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch flowchart data from ${fileUrl}`);
    }

    const jsonData = await response.json();

    const courseResponse = await fetch(courseUrl);
    if (!courseResponse.ok) {
      throw new Error(`Failed to fetch course data from ${courseUrl}`);
    }
    const courseData = await courseResponse.json();

    // Get all the courses from the flowchart data

    const termData = jsonData.termData;

    termData.forEach((term: Term) => {
      term.courses.forEach((course: Course) => {
        if (course.id) {
          // Find the course in the courseData
          const courseFromData = courseData.find(
            (c: Course) => c.id === course.id
          );
          // Add this desc to the course
          course.displayName = courseFromData.displayName;
          course.desc = courseFromData.desc;
          course.units = courseFromData.units;
        }
      });
    });

    console.log("termData with desc: ", termData);
    // Dispatch the action to update the flowchart data in the Redux store
    dispatch(fetchFlowchartData.fulfilled(jsonData, "", ""));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching flowchart data:", error);
    dispatch(fetchFlowchartData.rejected(error.toString(), "", ""));
  }
}

export async function fetchCourseCatalogHelper(catalog: string) {
  let courses: CourseSearch[] | null = null;
  let geCourses: CourseCatalog | null = null;
  let gwrCourses: CourseCatalog | null = null;
  try {
    const fileUrl = `https://raw.githubusercontent.com/polyflowbuilder/polyflowbuilder/refs/heads/main/api/data/courses/${catalog}/${catalog}.json`;
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch course catalog from ${fileUrl}`);
    }
    courses = await response.json();
  } catch (error) {
    console.error("Error fetching course catalog:", error);
  }
  try {
    const fileUrl = `https://raw.githubusercontent.com/polyflowbuilder/polyflowbuilder/refs/heads/main/api/data/courses/${catalog}/${catalog}-GE.json`;
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch course catalog from ${fileUrl}`);
    }
    const geCoursesData = await response.json();
    // Categorize the courses by subject: CSC101, CSC102, CSC103, etc.
    geCourses = categorizeCoursesBySubject(geCoursesData);
  } catch (error) {
    console.error("Error fetching GE course catalog:", error);
  }
  try {
    const fileUrl = `https://raw.githubusercontent.com/polyflowbuilder/polyflowbuilder/refs/heads/main/api/data/courses/${catalog}/${catalog}-GWR.json`;
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch course catalog from ${fileUrl}`);
    }
    const gwrCoursesData = await response.json();
    // Categorize the courses by subject: CSC101, CSC102, CSC103, etc.
    gwrCourses = categorizeCoursesBySubject(gwrCoursesData);
  } catch (error) {
    console.error("Error fetching GWR course catalog:", error);
  }
  return { courses, geCourses, gwrCourses };
}

function categorizeCoursesBySubject(courses: CourseSearch[]) {
  const categorizedCourses: CourseCatalog = {};
  for (const course of courses) {
    // Extract the subject from the course ID (e.g., "CSC101" -> "CSC")
    const subject = course.courseId.replace(/\d+/g, ""); // Remove numbers from the ID

    if (!categorizedCourses[subject]) {
      categorizedCourses[subject] = [];
    }
    categorizedCourses[subject].push(course);
  }
  return categorizedCourses;
}
