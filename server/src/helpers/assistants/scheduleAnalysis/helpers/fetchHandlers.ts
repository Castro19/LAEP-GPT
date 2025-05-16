import {
  ProfessorRatingDocument,
  ProfessorRatingFields,
  ScheduleBuilderFields,
  SectionDocument,
} from "@polylink/shared/types";
import { getProfessorRatings } from "../../../../db/models/professorRatings/professorRatingServices";
import { environment } from "../../../..";
import { findSectionsbyProjection } from "../../../../db/models/section/sectionCollection";

type SectionInfo = {
  courseId: string;
  classNumber: number;
  professors: { id: string | null; name: string }[];
};

async function fetchProfessors(
  fields: ProfessorRatingFields[],
  sectionInfo: SectionInfo[]
): Promise<Partial<ProfessorRatingDocument>[]> {
  // Fetch professors from MongoDB "professors"
  const professorRatingsProjection = fields.reduce(
    (acc, field) => {
      acc[field] = 1;
      return acc;
    },
    {} as Record<string, 1>
  );
  const professorIds = sectionInfo.flatMap((section) =>
    section.professors.map((professor) => professor.id)
  );
  const courseIds = sectionInfo.flatMap((section) => section.courseId);
  const professors = await getProfessorRatings(
    professorIds.filter((id): id is string => id !== null),
    courseIds,
    professorRatingsProjection as unknown as Partial<ProfessorRatingDocument>
  );

  if (environment === "dev") {
    console.log("PROFESSORS: ", professors);
  }

  return professors;
}

async function fetchSections(
  fields: ScheduleBuilderFields[],
  sectionInfo: SectionInfo[]
): Promise<Partial<SectionDocument>[]> {
  // Construct the projection object
  const sectionProjection = fields.reduce(
    (acc, field) => {
      acc[field] = 1;
      return acc;
    },
    {} as Record<string, 1>
  );

  // Add classNumber to projection
  sectionProjection.classNumber = 1;

  const query = {
    classNumber: { $in: sectionInfo.map((section) => section.classNumber) },
  }; // Ensure this is a valid filter object

  const sections = await findSectionsbyProjection(
    query, // Use the validated query object
    sectionProjection
  );

  if (environment === "dev") {
    console.log("FETCHED SECTIONS: ", sections);
  }

  const combinedSections = combineDuplicateSections(sections);
  return combinedSections;
}

async function fetchAlternativeSections(
  fields: ScheduleBuilderFields[],
  sectionInfo: SectionInfo[]
): Promise<Partial<SectionDocument>[]> {
  // Construct the projection object
  const sectionProjection = fields.reduce(
    (acc, field) => {
      acc[field] = 1;
      return acc;
    },
    {} as Record<string, 1>
  );
  // Add classNumber to projection
  sectionProjection.classNumber = 1;
  sectionProjection.professorInsights = 1;

  const query = {
    courseId: { $in: sectionInfo.map((section) => section.courseId) },
    classNumber: { $nin: sectionInfo.map((section) => section.classNumber) },
    enrollmentStatus: "O" as "O" | "C",
  };

  const sections = await findSectionsbyProjection(query, sectionProjection);

  const combinedSections = combineDuplicateSections(sections);
  return combinedSections;
}

// Helper function to combine duplicate sections
/**
 * Combines sections with identical properties (excluding `_id` and `meetings`)
 * into a single section, merging their `meetings` arrays.
 *
 * @param sections The raw MongoDB section results (projected fields).
 * @returns A new array of sections with duplicates merged.
 */
function combineDuplicateSections(
  sections: Partial<SectionDocument>[]
): Partial<SectionDocument>[] {
  // Maps a "signature" (stringified fields except `_id` & `meetings`)
  // -> aggregated section data.
  const signatureMap = new Map<
    string, // The JSON signature
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { baseSection: Record<string, any>; meetings: any[] }
  >();

  for (const sec of sections) {
    // 1. Create a shallow copy so we can safely remove fields
    const signatureObject = { ...sec };
    delete signatureObject._id; // Remove MongoDB's _id
    delete signatureObject.meetings; // We'll handle meetings separately

    // 2. Convert the signature object to a JSON string
    const signature = JSON.stringify(sec.courseId);

    // 3. Check if we've already seen this signature
    if (!signatureMap.has(signature)) {
      // New entry => store baseSection and copy of meetings
      signatureMap.set(signature, {
        baseSection: signatureObject,
        meetings: sec.meetings ? [...sec.meetings] : [],
      });
    } else {
      // Existing entry => merge meetings
      const existing = signatureMap.get(signature)!;
      if (sec.meetings && Array.isArray(sec.meetings)) {
        existing.meetings.push(...sec.meetings);
      }
    }
  }
  // 5. Build and return the final list
  const combined: Partial<SectionDocument>[] = [];
  for (const [, { baseSection, meetings }] of signatureMap.entries()) {
    // Reconstruct the final object
    const finalObj = { ...baseSection };
    // Include meetings if any exist
    if (meetings && meetings.length > 0) {
      finalObj.meetings = meetings;
    }
    combined.push(finalObj);
  }

  return combined;
}

export { fetchProfessors, fetchSections, fetchAlternativeSections };
