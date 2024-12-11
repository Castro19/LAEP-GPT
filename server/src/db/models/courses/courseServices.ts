// Store the course catalog data in MongoDB
import { environment } from "../../../index";
import * as courseCollection from "./courseCollection";
import {
  CourseQuery,
  SubjectQuery,
  CourseDocument,
  MongoQuery,
  CourseObject,
} from "@polylink/shared/types";

export const getCourses = async (
  queryParams: CourseQuery
): Promise<CourseObject[]> => {
  const { catalogYear, searchTerm } = queryParams;
  let query = {} as MongoQuery<CourseDocument>;

  if (catalogYear) {
    query.catalogYear = catalogYear;
  }
  // Initialize filters
  const filters = [];

  // Handle searchTerm
  if (searchTerm) {
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filters.push({
      courseId: { $regex: "^" + escapedSearchTerm, $options: "i" },
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

  const courseDocument = await courseCollection.findCourse(
    catalogYear,
    courseId
  );

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
