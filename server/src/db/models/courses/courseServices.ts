// Store the course catalog data in MongoDB
import { environment } from "../../../index";
import * as techElectiveCollection from "./techElectiveCollection";
import * as courseCollection from "./courseCollection";
import {
  CourseQuery,
  SubjectQuery,
  CourseDocument,
  CourseObject,
  FormattedGeCourses,
} from "@polylink/shared/types";
import * as geCollection from "./geCollection";
import { MongoQuery } from "../../../types/mongo";
import {
  ensureCatalogYear,
  formatGeCoursesByCategoryAndSubject,
  formatGeCoursesByCategoryAndSubjectWithObjects,
  getCatalogYear,
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
  courseIds: string[],
  catalogYear?: string
): Promise<CourseObject[]> => {
  if (!courseIds) {
    throw new Error("Course IDs are required");
  }
  try {
    return (await courseCollection.findCourseInfo(
      courseIds,
      catalogYear
    )) as CourseObject[];
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

export const getGeSubjects = async (
  area: string,
  catalogYear: string
): Promise<string[]> => {
  if (!catalogYear) {
    catalogYear = "2022-2026";
  }
  try {
    const geSubjects = await geCollection.findGeSubjects(area, catalogYear);
    // remove duplicates and make them alphabetical
    const uniqueGeSubjects = [
      ...new Set(geSubjects.map((subject) => subject.subject)),
    ]
      .sort()
      .map((subject) => subject);
    return uniqueGeSubjects;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching GE subjects: ", error);
    }
    throw error;
  }
};

export const getGeCourses = async (
  subject: string,
  area: string,
  catalogYear: string
): Promise<FormattedGeCourses> => {
  if (!catalogYear) {
    catalogYear = "2022-2026";
  }

  try {
    // Get the GE courses
    const geCourses = await geCollection.findGeCourses(
      subject,
      area,
      catalogYear
    );

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
    const courseObjects = await courseCollection.findCourses(
      {
        courseId: { $in: allCourseIds },
        catalogYear: catalogYear,
      },
      100
    );

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

export const getTechElectiveInfo = async (
  code: string
): Promise<{
  major: string;
  concentration: string;
  url: string;
  categories: string[];
}> => {
  if (!code) {
    throw new Error("Code is required");
  }
  const updatedCode = await ensureCatalogYear(code);
  try {
    const techElective =
      await techElectiveCollection.findTechElectiveCourses(updatedCode);

    const categoryNames = techElective.techElectives.map((techElective) => {
      if (techElective.name) {
        return techElective.name;
      }
      return "Electives";
    });

    const techElectiveInfo = {
      major: techElective.major,
      concentration: techElective.concentration,
      url: techElective.url,
      categories: categoryNames,
    };

    return techElectiveInfo;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching tech elective courses: ", error);
    }
    throw error;
  }
};

export const getTechElectiveSubjects = async (
  code: string,
  category: string
): Promise<string[]> => {
  if (!code) {
    throw new Error("Code is required");
  }
  if (!category) {
    throw new Error("Category is required");
  }
  const updatedCode = await ensureCatalogYear(code);
  try {
    const techElective =
      await techElectiveCollection.findTechElectiveCourses(updatedCode);

    // Find the tech elective category that matches the requested category
    // Use case-insensitive comparison for category names
    const matchingCategory = techElective.techElectives.find(
      (techElective) =>
        (techElective.name &&
          techElective.name.toLowerCase() === category.toLowerCase()) ||
        (techElective.name === null && category.toLowerCase() === "electives")
    );

    if (!matchingCategory) {
      return [];
    }

    // Extract subject codes from course codes (e.g., "CPE428" -> "CPE")
    const subjectCodes = matchingCategory.courses.map((courseCode) => {
      // Extract the subject code (letters before the numbers)
      const match = courseCode.match(/^([A-Za-z]+)/);
      return match ? match[1] : "";
    });

    // Remove duplicates and empty strings
    return [...new Set(subjectCodes)].filter(Boolean);
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching tech elective subjects: ", error);
    }
    throw error;
  }
};

export const getTechElectiveCourses = async (
  category: string,
  code: string,
  subject?: string
): Promise<{ courses: string[]; notes: string | null }> => {
  if (!code) {
    throw new Error("Code is required");
  }
  if (!category) {
    throw new Error("Category is required");
  }
  const updatedCode = await ensureCatalogYear(code);
  try {
    const techElective =
      await techElectiveCollection.findTechElectiveCourses(updatedCode);

    // Find the tech elective category that matches the requested category
    // Use case-insensitive comparison for category names
    const matchingCategory = techElective.techElectives.find(
      (techElective) =>
        (techElective.name &&
          techElective.name.toLowerCase() === category.toLowerCase()) ||
        (techElective.name === null && category.toLowerCase() === "electives")
    );

    if (!matchingCategory) {
      return { courses: [], notes: null };
    }

    // If subject is provided, filter courses by that subject
    let filteredCourses = matchingCategory.courses;
    if (subject) {
      filteredCourses = matchingCategory.courses.filter((courseCode) => {
        // Extract the subject code (letters before the numbers)
        const match = courseCode.match(/^([A-Za-z]+)/);
        const courseSubject = match ? match[1] : "";
        return courseSubject.toLowerCase() === subject.toLowerCase();
      });
    }

    return {
      courses: filteredCourses,
      notes: matchingCategory.notes,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching tech elective courses: ", error);
    }
    throw error;
  }
};

export const getTechElectiveCourseDetails = async (
  category: string,
  code: string,
  subject?: string
): Promise<CourseObject[]> => {
  if (!code) {
    throw new Error("Code is required");
  }
  if (!category) {
    throw new Error("Category is required");
  }
  const catalogYear = getCatalogYear(code);

  if (!catalogYear) {
    throw new Error("Invalid code. Could not find its catalog year");
  }
  const updatedCode = await ensureCatalogYear(code);
  try {
    // First get the filtered course codes
    const { courses } = await getTechElectiveCourses(
      category,
      updatedCode,
      subject
    );

    if (courses.length === 0) {
      return [];
    }

    // Get detailed course information for each course code
    const courseDetails = await getCourseInfo(courses);

    return courseDetails;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching tech elective course details: ", error);
    }
    throw error;
  }
};
