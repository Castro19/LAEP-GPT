// helpers/fetchCourses.ts
import { environment, serverUrl } from "@/helpers/getEnvironmentVars";
import { CourseObject } from "@polylink/shared/types";

export const fetchCoursesAPI = async (
  catalogYear: string,
  inputValue?: string
) => {
  try {
    const params = new URLSearchParams();
    params.append("catalogYear", catalogYear);
    if (inputValue) params.append("searchTerm", inputValue);
    const response = await fetch(`${serverUrl}/courses?${params.toString()}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: CourseObject[] = await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch courses:", err);
    }
    throw err;
  }
};

/**
 *
 * @param catalogYear
 * @param query
 * @returns an array of subject names (strings)
 */
export const fetchSubjectNamesAPI = async (
  catalogYear: string,
  query: { gwr: string; uscp: string; searchTerm: string }
): Promise<string[]> => {
  try {
    const params = new URLSearchParams();
    params.append("catalogYear", catalogYear);
    if (query.gwr !== undefined) params.append("GWR", query.gwr);
    if (query.uscp !== undefined) params.append("USCP", query.uscp);
    if (query.searchTerm) params.append("searchTerm", query.searchTerm);

    const response = await fetch(
      `${serverUrl}/courses/subjectNames?${params.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: string[] = await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch subject names:", err);
    }
    throw err;
  }
};

/**
 *
 * @param catalogYear
 * @param query
 * @returns an array of courses for a given subject of size === pageSize
 */
export const fetchCoursesBySubjectAPI = async (
  catalogYear: string,
  query: {
    gwr: string;
    uscp: string;
    page: string;
    pageSize: string;
    subject: string;
  }
): Promise<CourseObject[]> => {
  try {
    const params = new URLSearchParams();
    params.append("catalogYear", catalogYear);
    params.append("subject", query.subject);
    params.append("page", query.page);
    params.append("pageSize", query.pageSize);
    if (query.gwr !== undefined) params.append("GWR", query.gwr);
    if (query.uscp !== undefined) params.append("USCP", query.uscp);

    const response = await fetch(
      `${serverUrl}/courses/subject?${params.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: CourseObject[] = await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch courses by subject:", err);
    }
    throw err;
  }
};

/**
 * Fetches GE areas for a given catalog year
 * @param catalogYear The catalog year to fetch GE areas for
 * @param completedCourseIds Array of completed course IDs
 * @returns An array of GE areas with completion status
 */
export const fetchGeAreasAPI = async (
  catalogYear: string,
  completedCourseIds: string[]
): Promise<{ category: string; completed: boolean }[]> => {
  const params = new URLSearchParams();
  params.append("catalogYear", catalogYear);
  if (completedCourseIds.length > 0) {
    params.append("completedCourseIds", completedCourseIds.join(","));
  }

  try {
    const response = await fetch(
      `${serverUrl}/courses/ge/areas?${params.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch GE areas:", err);
    }
    throw err;
  }
};

export const fetchGeSubjectsAPI = async (
  area: string,
  catalogYear: string,
  completedCourseIds: string[]
): Promise<{ subject: string; completed: boolean }[]> => {
  try {
    const params = new URLSearchParams();
    params.append("area", area);
    params.append("catalogYear", catalogYear);
    if (completedCourseIds.length > 0) {
      params.append("completedCourseIds", completedCourseIds.join(","));
    }

    const response = await fetch(
      `${serverUrl}/courses/ge/subjects?${params.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: { subject: string; completed: boolean }[] =
      await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch GE subjects:", err);
    }
    throw err;
  }
};

/**
 * Fetches GE courses for a specific area and catalog year
 * @param area The GE area to fetch courses for
 * @param catalogYear The catalog year to fetch courses for
 * @returns A nested object with categories as top level, subjects as second level, and CourseObjects as values
 */
export const fetchGeCoursesAPI = async (
  subject: string,
  area: string,
  catalogYear: string
): Promise<Record<string, Record<string, CourseObject[]>>> => {
  try {
    const response = await fetch(
      `${serverUrl}/courses/ge/${subject}/${area}/${catalogYear}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch GE courses:", err);
    }
    throw err;
  }
};

/**
 * Fetches tech elective information for a given code
 * @param code The tech elective code
 * @returns Tech elective information including major, concentration, URL, and categories
 */
export const fetchTechElectiveInfoAPI = async (
  code: string
): Promise<{
  major: string;
  concentration: string;
  url: string;
  categories: string[];
}> => {
  try {
    const response = await fetch(
      `${serverUrl}/courses/techElective/info/${code}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch tech elective info:", err);
    }
    throw err;
  }
};

/**
 * Fetches subject codes for a given tech elective category
 * @param category The tech elective category
 * @param code The tech elective code
 * @returns Array of subject codes
 */
export const fetchTechElectiveSubjectsAPI = async (
  category: string,
  code: string
): Promise<string[]> => {
  try {
    // Encode the category to handle spaces and special characters
    const encodedCategory = encodeURIComponent(category);

    const response = await fetch(
      `${serverUrl}/courses/techElective/subjects/${encodedCategory}/${code}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch tech elective subjects:", err);
    }
    throw err;
  }
};

/**
 * Fetches courses for a given tech elective category and subject
 * @param subject The subject code (e.g., "CSC")
 * @param category The tech elective category
 * @param code The tech elective code
 * @returns Object containing courses and notes
 */
export const fetchTechElectiveCoursesAPI = async (
  subject: string,
  category: string,
  code: string
): Promise<{
  courses: string[];
  notes: string | null;
}> => {
  try {
    // Encode the category and subject to handle spaces and special characters
    const encodedCategory = encodeURIComponent(category);
    const encodedSubject = encodeURIComponent(subject);

    const response = await fetch(
      `${serverUrl}/courses/techElective/${encodedSubject}/${encodedCategory}/${code}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch tech elective courses:", err);
    }
    throw err;
  }
};

/**
 * Fetches detailed course information for a given tech elective category and subject
 * @param subject The subject code (e.g., "CSC")
 * @param category The tech elective category
 * @param code The tech elective code
 * @returns Array of course objects with detailed information
 */
export const fetchTechElectiveCourseDetailsAPI = async (
  subject: string,
  category: string,
  code: string
): Promise<CourseObject[]> => {
  try {
    // Encode the category and subject to handle spaces and special characters
    const encodedCategory = encodeURIComponent(category);
    const encodedSubject = encodeURIComponent(subject);

    const response = await fetch(
      `${serverUrl}/courses/techElective/${encodedSubject}/${encodedCategory}/${code}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (environment === "dev") {
      console.error("Failed to fetch tech elective course details:", err);
    }
    throw err;
  }
};
