import { serverUrl } from "@/helpers/getEnvironmentVars";
import { SectionDetail, SelectedSection } from "@polylink/shared/types";
import { v4 as uuidv4 } from "uuid";
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

export async function createOrUpdateSection(section: SelectedSection): Promise<{
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
    throw new Error(error.message || "Failed to create flowchart");
  }
  const data: {
    selectedSections: SelectedSection[];
    message: string;
  } = await response.json();
  return data;
}

export function transformSectionToSelectedSection(
  section: SectionDetail
): SelectedSection {
  return {
    sectionId: uuidv4(),
    courseId: section.courseId,
    classNumber: section.classNumber,
    component: section.component,
    enrollmentStatus: section.enrollmentStatus,
    meetings: section.meetings,
    classPair: section.pairedSections,
  };
}
