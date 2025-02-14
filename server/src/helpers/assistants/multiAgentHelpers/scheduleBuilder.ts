import {
  ProfessorRatingDocument,
  ScheduleBuilderObject,
  SectionDocument,
} from "@polylink/shared/types";
import { environment } from "../../..";
import { getProfessorRatings } from "../../../db/models/professorRatings/professorRatingServices";
import { findSectionsbyProjection } from "../../../db/models/section/sectionCollection";

/**
 *
 * @param messageToAdd
 * @param jsonObject
 * @returns messageToAdd with schedule or professors added
 */
async function scheduleBuilder(
  messageToAdd: string,
  jsonObject: ScheduleBuilderObject
): Promise<string> {
  switch (jsonObject.queryType) {
    case "schedule":
      messageToAdd += await fetchSections(jsonObject, messageToAdd);
      break;
    case "professors":
      messageToAdd += await fetchProfessors(jsonObject, messageToAdd);
      break;
    case "both":
      messageToAdd += await fetchSections(jsonObject, messageToAdd);
      messageToAdd += await fetchProfessors(jsonObject, messageToAdd);
      break;
  }
  return messageToAdd;
}

async function fetchProfessors(
  jsonObject: ScheduleBuilderObject,
  messageToAdd: string
): Promise<string> {
  // Fetch professors from MongoDB "professors"
  const professorRatingsProjection = jsonObject.fetchProfessors.fields.reduce(
    (acc, field) => {
      acc[field] = 1;
      return acc;
    },
    {} as Record<string, 1>
  );
  const professorIds = jsonObject.fetchProfessors.sectionInfo.flatMap(
    (section) => section.professors.map((professor) => professor.id)
  );
  const courseIds = jsonObject.fetchProfessors.sectionInfo.flatMap(
    (section) => section.courseId
  );
  const professors = await getProfessorRatings(
    professorIds.filter((id): id is string => id !== null),
    courseIds,
    professorRatingsProjection as unknown as Partial<ProfessorRatingDocument>
  );

  if (environment === "dev") {
    console.log("Professors: ", professors);
  }

  messageToAdd += `Here are the professors for the class numbers ${jsonObject.fetchSections.classNumbers}: ${JSON.stringify(
    professors
  )}`;
  return messageToAdd;
}

async function fetchSections(
  jsonObject: ScheduleBuilderObject,
  messageToAdd: string
): Promise<string> {
  // Fetch schedule from MongoDB "sectionsSpring"
  const fields = jsonObject.fetchSections.fields;
  if (environment === "dev") {
    console.log("Fields: ", fields);
  }
  // Construct the projection object
  const sectionProjection = fields.reduce(
    (acc, field) => {
      acc[field] = 1;
      return acc;
    },
    {} as Record<string, 1>
  );

  // Ensure classNumbers is a valid array for the query
  const classNumbers = jsonObject.fetchSections.classNumbers;
  if (!Array.isArray(classNumbers) || classNumbers.length === 0) {
    throw new Error("Invalid class numbers provided for query.");
  }

  const query = { classNumber: { $in: classNumbers } }; // Ensure this is a valid filter object

  const sections = await findSectionsbyProjection(
    query, // Use the validated query object
    sectionProjection
  );

  if (environment === "dev") {
    console.log("FETCHED SECTIONS: ", sections);
  }

  const combinedSections = combineDuplicateSections(sections);

  messageToAdd += `Here are the sections for the class numbers ${jsonObject.fetchSections.classNumbers}: ${JSON.stringify(
    combinedSections
  )}`;
  if (environment === "dev") {
    console.log("MESSAGE TO ADD: ", messageToAdd);
  }
  return messageToAdd;
}
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

export default scheduleBuilder;
