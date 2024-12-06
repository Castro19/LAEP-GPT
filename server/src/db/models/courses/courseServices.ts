// Store the course catalog data in MongoDB
import * as courseCollection from "./courseCollection.js";
import {
  CourseQuery,
  SubjectQuery,
  CourseDocument,
  MongoQuery,
} from "../../../types";

export const getCourses = async (queryParams: CourseQuery) => {
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

export const getCourse = async (queryParams: CourseQuery) => {
  const { catalogYear, courseId } = queryParams;
  if (!catalogYear || !courseId) {
    throw new Error("Catalog year and course ID are required");
  }

  return await courseCollection.findCourse(catalogYear, courseId);
};

export const getCoursesBySubject = async (queryParams: SubjectQuery) => {
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
  return result[0].courses;
};

export const getSubjectNames = async (queryParams: SubjectQuery) => {
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

export const getCourseInfo = async (courseIds: string[]) => {
  if (!courseIds) {
    throw new Error("Course IDs are required");
  }
  try {
    return await courseCollection.findCourseInfo(courseIds);
  } catch (error) {
    console.error("Error fetching course info: ", error);
    throw error;
  }
};
