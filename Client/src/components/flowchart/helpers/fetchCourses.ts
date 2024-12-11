// helpers/apiHelper.js

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
  query: { ge: string; gwr: string; uscp: string; searchTerm: string }
): Promise<string[]> => {
  try {
    const params = new URLSearchParams();
    params.append("catalogYear", catalogYear);
    if (query.ge !== undefined) params.append("GE", query.ge);
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
