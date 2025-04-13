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
 * @returns An array of GE area names
 */
export const fetchGeAreasAPI = async (
  catalogYear: string
): Promise<string[]> => {
  try {
    const response = await fetch(
      `${serverUrl}/courses/ge/areas/${catalogYear}`,
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
      console.error("Failed to fetch GE areas:", err);
    }
    throw err;
  }
};

export const fetchGeSubjectsAPI = async (
  area: string,
  catalogYear: string
): Promise<string[]> => {
  try {
    const response = await fetch(
      `${serverUrl}/courses/ge/subjects/${area}/${catalogYear}`,
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
