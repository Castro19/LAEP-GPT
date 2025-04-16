import { environment, serverUrl } from "@/helpers/getEnvironmentVars";
import {
  SectionDetail,
  SelectedSection,
  SelectedSectionItem,
} from "@polylink/shared/types";

export async function fetchSections(): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> {
  const response = await fetch(`${serverUrl}/selectedSections`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create flowchart");
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
    body: JSON.stringify({ section }),
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

export async function removeSection(sectionId: number): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> {
  try {
    const response = await fetch(`${serverUrl}/selectedSections/${sectionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

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

export function transformSectionToSelectedSectionItem(
  section: SectionDetail,
  term: "spring2025" | "summer2025"
): SelectedSectionItem {
  return {
    sectionId: section.classNumber,
    term,
  };
}
