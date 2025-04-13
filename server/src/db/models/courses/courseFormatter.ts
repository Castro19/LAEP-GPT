import {
  geDocument,
  CourseObject,
  FormattedGeCourses,
} from "@polylink/shared/types";

/**
 * Formats geDocuments into a nested structure organized by category and subject
 * @param geCourses List of geDocuments to format
 * @returns Nested object with categories as top level, subjects as second level, and course IDs as values
 */
type FormatGeCoursesReturnType = Record<string, Record<string, string[]>>;

export const formatGeCoursesByCategoryAndSubject = (
  geCourses: geDocument[]
): FormatGeCoursesReturnType => {
  // Initialize the result object
  const result: FormatGeCoursesReturnType = {};

  // Process each course
  geCourses.forEach((course) => {
    // Extract subject from course ID (letters at the beginning)
    const subject = course.id.match(/^[A-Z]+/)?.[0] || "UNKNOWN";

    // Initialize category if it doesn't exist
    if (!result[course.category]) {
      result[course.category] = {};
    }

    // Initialize subject array if it doesn't exist
    if (!result[course.category][subject]) {
      result[course.category][subject] = [];
    }

    // Add course ID to the appropriate subject array if not already present
    if (!result[course.category][subject].includes(course.id)) {
      result[course.category][subject].push(course.id);
    }
  });

  return result;
};

/**
 * Formats geDocuments into a nested structure organized by category and subject with full course objects
 * @param geCourses List of geDocuments to format
 * @param courseObjects Map of course IDs to their full CourseObject representations
 * @returns Nested object with categories as top level, subjects as second level, and CourseObjects as values
 */
export const formatGeCoursesByCategoryAndSubjectWithObjects = (
  geCourses: geDocument[],
  courseObjects: CourseObject[]
): FormattedGeCourses => {
  // Create a map of course IDs to their full objects for quick lookup
  const courseMap = new Map<string, CourseObject>();
  courseObjects.forEach((course) => {
    courseMap.set(course.courseId, course);
  });

  // Initialize the result object
  const result: FormattedGeCourses = {};

  // Process each course
  geCourses.forEach((course) => {
    // Extract subject from course ID (letters at the beginning)
    const subject = course.id.match(/^[A-Z]+/)?.[0] || "UNKNOWN";

    // Initialize category if it doesn't exist
    if (!result[course.category]) {
      result[course.category] = {};
    }

    // Initialize subject array if it doesn't exist
    if (!result[course.category][subject]) {
      result[course.category][subject] = [];
    }

    // Add course object to the appropriate subject array if not already present
    const courseObject = courseMap.get(course.id);
    if (
      courseObject &&
      !result[course.category][subject].some((c) => c.courseId === course.id)
    ) {
      result[course.category][subject].push(courseObject);
    }
  });

  return result;
};
