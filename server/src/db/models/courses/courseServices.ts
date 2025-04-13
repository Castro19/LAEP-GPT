// Store the course catalog data in MongoDB
import { environment } from "../../../index";
import * as courseCollection from "./courseCollection";
import {
  CourseQuery,
  SubjectQuery,
  CourseDocument,
  CourseObject,
} from "@polylink/shared/types";
import * as geCollection from "./geCollection";
import { MongoQuery } from "../../../types/mongo";
import {
  formatGeCoursesByCategoryAndSubject,
  formatGeCoursesByCategoryAndSubjectWithObjects,
} from "./courseFormatter";

export const getCourses = async (
  queryParams: CourseQuery
): Promise<CourseObject[]> => {
  const { catalogYear, searchTerm } = queryParams;
  let query = {} as MongoQuery<CourseDocument>;

  if (catalogYear) {
    // I believe we should hardcode catalog year to 2022-2026 to get the most recent courses.
    query.catalogYear = "2022-2026";
  }
  // Initialize filters
  const filters = [];

  // Handle searchTerm
  if (searchTerm) {
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filters.push({
      $or: [
        { courseId: { $regex: escapedSearchTerm, $options: "i" } },
        { displayName: { $regex: escapedSearchTerm, $options: "i" } },
      ],
    });
  }

  // Combine filters
  if (filters.length > 0) {
    query = { ...query, $and: filters as MongoQuery<CourseDocument>[] };
  }

  return await courseCollection.findCourses(query);
};

export const getCourse = async (
  queryParams: CourseQuery
): Promise<CourseObject | null> => {
  const { catalogYear, courseId } = queryParams;
  if (!catalogYear || !courseId) {
    throw new Error("Catalog year and course ID are required");
  }

  let courseDocument = await courseCollection.findCourse(catalogYear, courseId);

  if (!courseDocument) {
    // TO-DO: Look into this to see if this is fine
    courseDocument = await courseCollection.findCourse("2022-2026", courseId);
  }

  if (!courseDocument) {
    return null;
  }

  const course = {
    courseId: courseDocument.courseId,
    displayName: courseDocument.displayName,
    units: courseDocument.units,
    desc: courseDocument.desc,
  };
  return course as CourseObject;
};

export const getCoursesBySubject = async (
  queryParams: SubjectQuery
): Promise<CourseObject[]> => {
  const { catalogYear, GE, GWR, USCP, subject, page, pageSize } = queryParams;

  let query = {} as MongoQuery<CourseDocument>;

  if (!subject) {
    throw new Error("Subject is required");
  }

  if (catalogYear) {
    query.catalogYear = catalogYear;
  }

  // Initialize filters
  const filters = [];

  // Convert string query parameters to booleans
  const isGE = GE === "true";
  const isGWR = GWR === "true";
  const isUSCP = USCP === "true";
  // Handle GWR filter
  if (isGWR) {
    filters.push({ gwrCourse: true });
  }

  // Handle USCP filter
  if (isUSCP) {
    filters.push({ uscpCourse: true });
  }
  // Handle GE filter
  if (isGE) {
    // Assuming GE courses have non-empty geCategories array
    filters.push({ geCategories: { $exists: true, $ne: [] } });
  }

  // Combine filters
  if (filters.length > 0) {
    query = { ...query, $and: filters };
  }

  const result = await courseCollection.findCoursesGroupedBySubjectNames(
    subject,
    query,
    page,
    Number(pageSize)
  );
  return result;
};

export const getSubjectNames = async (
  queryParams: SubjectQuery
): Promise<string[]> => {
  const { GWR, USCP } = queryParams;

  let query = {};
  // Initialize filters
  const filters = [];

  // Convert string query parameters to booleans
  const isGWR = GWR === "true";
  const isUSCP = USCP === "true";

  // Handle GWR filter
  if (isGWR) {
    filters.push({ gwrCourse: true });
  }

  // Handle USCP filter
  if (isUSCP) {
    filters.push({ uscpCourse: true });
  }
  // Combine filters
  if (filters.length > 0) {
    query = { ...query, $and: filters };
  }

  return await courseCollection.findSubjectNames(query);
};

export const getCourseInfo = async (
  courseIds: string[]
): Promise<CourseObject[]> => {
  if (!courseIds) {
    throw new Error("Course IDs are required");
  }
  try {
    return (await courseCollection.findCourseInfo(courseIds)) as CourseObject[];
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching course info: ", error);
    }
    throw error;
  }
};

export const getGeAreas = async (catalogYear: string): Promise<string[]> => {
  if (!catalogYear) {
    catalogYear = "2022-2026";
  }
  try {
    const geAreas = await geCollection.findGeAreas(catalogYear);
    // remove duplicates and make them alphabetical
    const uniqueGeAreas = [...new Set(geAreas.map((area) => area.category))]
      .sort()
      .map((area) => area);
    return uniqueGeAreas;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching GE areas: ", error);
    }
    throw error;
  }
};

export const getGeCourses = async (
  area: string,
  catalogYear: string
): Promise<Record<string, Record<string, CourseObject[]>>> => {
  if (!catalogYear) {
    catalogYear = "2022-2026";
  }

  try {
    // Get the GE courses
    const geCourses = await geCollection.findGeCourses(area, catalogYear);

    // First format to get the structure with IDs
    const formattedByIds = formatGeCoursesByCategoryAndSubject(geCourses);

    // Collect all unique course IDs
    const allCourseIds: string[] = [];
    Object.values(formattedByIds).forEach((subjectMap) => {
      Object.values(subjectMap).forEach((courseIds) => {
        courseIds.forEach((id) => {
          if (!allCourseIds.includes(id)) {
            allCourseIds.push(id);
          }
        });
      });
    });

    // Fetch all course objects
    const courseObjects = await courseCollection.findCourses({
      courseId: { $in: allCourseIds },
      catalogYear: catalogYear,
    });

    // Format with the full course objects
    return formatGeCoursesByCategoryAndSubjectWithObjects(
      geCourses,
      courseObjects
    );
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching GE courses: ", error);
    }
    throw error;
  }
};
