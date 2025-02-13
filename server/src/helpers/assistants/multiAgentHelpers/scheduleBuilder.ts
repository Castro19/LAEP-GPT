import {
  ProfessorRatingDocument,
  ScheduleBuilderObject,
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
  // Fetch schedule from MongoDB "sectionsSpring"
  const fields = jsonObject.fetchSections.fields;

  // Construct the projection object
  const sectionProjection = fields.reduce(
    (acc, field) => {
      acc[field] = 1;
      return acc;
    },
    {} as Record<string, 1>
  );

  const sections = await findSectionsbyProjection(
    jsonObject.fetchSections.classNumbers,
    sectionProjection // Pass the constructed projection object
  );

  if (environment === "dev") {
    console.log("Sections: ", sections);
  }

  messageToAdd += `Here are the sections for the class numbers ${jsonObject.fetchSections.classNumbers}: ${JSON.stringify(
    sections
  )}`;

  if (jsonObject.queryType === "both") {
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
  }
  return messageToAdd;
}

export default scheduleBuilder;
