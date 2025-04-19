import { environment, serverUrl } from "@/helpers/getEnvironmentVars";
import {
  SectionDetail,
  SelectedSection,
  SelectedSectionItem,
  CourseTerm,
} from "@polylink/shared/types";

export async function fetchSections(term: CourseTerm): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> {
  const url = `${serverUrl}/selectedSections/${term}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch selected sections");
  }
  const data: {
    selectedSections: SelectedSection[];
    message: string;
  } = await response.json();
  return data;
}

export async function createOrUpdateSection(
  section: SelectedSectionItem
): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> {
  const response = await fetch(`${serverUrl}/selectedSections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ sectionId: section.sectionId, term: section.term }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create or update section");
  }
  const data: {
    selectedSections: SelectedSection[];
    message: string;
  } = await response.json();
  return data;
}

export async function removeSection(
  sectionId: number,
  term: CourseTerm
): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> {
  try {
    const response = await fetch(
      `${serverUrl}/selectedSections/${term}/${sectionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to remove section");
    }

    const data: {
      selectedSections: SelectedSection[];
      message: string;
    } = await response.json();
    return data;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error removing section:", error);
    }
    throw error;
  }
}

export function transformSectionDetailToSelectedSectionItem(
  section: SectionDetail
): SelectedSectionItem {
  return {
    sectionId: section.classNumber,
    term: section.term,
  };
}
