import { environment, serverUrl } from "@/helpers/getEnvironmentVars";
import { SectionsFilterParams, Section } from "@polylink/shared/types";

const buildQueryString = (filter: SectionsFilterParams) => {
  const queryParams = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
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
  total: number;
};
export async function queryAI(message: string): Promise<QueryAIResponse> {
  console.log("query", message);
  try {
    const response = await fetch(`${serverUrl}/llms/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create flowchart");
    }
    const { query, explanation, results, total } = await response.json();
    return { query, explanation, results, total };
  } catch (error) {
    if (environment === "dev") {
      console.error("Error querying AI", error);
    }
    throw error;
  }
}
