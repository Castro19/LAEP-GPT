import { environment, serverUrl } from "@/helpers/getEnvironmentVars";
import { SectionsFilterParams, Section } from "@polylink/shared/types";

const buildQueryString = (filter: SectionsFilterParams) => {
  const queryParams = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      // Check for the techElectives object and flatten it
      if (key === "techElectives" && typeof value === "object") {
        const { major, concentration } = value as {
          major: string;
          concentration: string;
        };
        queryParams.append("techElectives.major", major);
        queryParams.append("techElectives.concentration", concentration);
      } else if (Array.isArray(value)) {
        // If it's an array, append each item
        value.forEach((v) => queryParams.append(key, v.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  return queryParams.toString();
};
/**
 * Creates a flowchart based on the flowchart data.
 * @param filter The filter for the sections.
 * @returns The sections.
 */
export async function fetchSections(
  filter: SectionsFilterParams,
  pageNumber: number
): Promise<{
  data: Section[];
  page: number;
  totalPages: number;
}> {
  const queryString = buildQueryString(filter);
  if (environment === "dev") {
    console.log("queryString", queryString);
  }
  const response = await fetch(
    `${serverUrl}/sections?${queryString}&page=${pageNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create flowchart");
  }
  const { data, page, totalPages } = await response.json();
  return { data, page, totalPages };
}

type QueryAIResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  explanation: string;
  results: Section[];
  totalPages: number;
};
export async function queryAI(message: string): Promise<QueryAIResponse> {
  console.log("queryAI", message);
  try {
    const response = await fetch(`${serverUrl}/llms/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create flowchart");
    }
    const { query, explanation, results, totalPages } = await response.json();
    return { query, explanation, results, totalPages };
  } catch (error) {
    if (environment === "dev") {
      console.error("Error querying AI", error);
    }
    throw error;
  }
}

export async function querySections(
  query: SectionsFilterParams,
  pageNumber: number
) {
  const response = await fetch(`${serverUrl}/sections/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ query, page: pageNumber }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create flowchart");
  }
  const { data, page, totalPages } = await response.json();
  return { data, page, totalPages };
}

export async function getSectionByClassNumber(classNumber: string) {
  const response = await fetch(
    `${serverUrl}/sections?classNumber=${classNumber}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create flowchart");
  }
  const { data } = await response.json();
  return data;
}
