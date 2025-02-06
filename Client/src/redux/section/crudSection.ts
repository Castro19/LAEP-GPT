import { serverUrl } from "@/helpers/getEnvironmentVars";
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
