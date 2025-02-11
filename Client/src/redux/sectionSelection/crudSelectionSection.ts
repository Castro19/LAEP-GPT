import { environment, serverUrl } from "@/helpers/getEnvironmentVars";
import { SectionDetail, SelectedSection } from "@polylink/shared/types";

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

export function transformSectionToSelectedSection(
  section: SectionDetail
): SelectedSection {
  return {
    courseId: section.courseId,
    courseName: section.courseName,
    classNumber: section.classNumber,
    component: section.component,
    enrollmentStatus: section.enrollmentStatus,
    meetings: section.meetings.map((meeting) => ({
      ...meeting,
      days: meeting.days.filter((day) => day),
    })),
    classPair: section.pairedSections,
    professor: section.instructors.map((instructor) => instructor.name),
    rating:
      section.instructorsWithRatings?.[0]?.overallRating ||
      section.instructorsWithRatings?.[1]?.overallRating ||
      0,
  };
}
