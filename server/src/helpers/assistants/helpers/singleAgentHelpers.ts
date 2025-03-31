import { fetchFlowchart } from "../../../db/models/flowchart/flowchartServices";
import { searchCourses } from "../../qdrant/qdrantQuery";
import { getCourseInfo } from "../../../db/models/courses/courseServices";
import flowchartHelper from "../../flowchart/flowchart";
import { UserData } from "@polylink/shared/types";

export const flowchartAssistant = async (
  user: UserData,
  message: string
): Promise<string> => {
  const flowchart = await fetchFlowchart(
    user.flowchartInformation.flowchartId,
    user.userId
  );
  // const courseIds = await searchCourses(message, null, 5);
  // const courseObjects = await getCourseInfo(courseIds);
  // const courseDescriptions = JSON.stringify(courseObjects);

  const {
    formattedRequiredCourses,
    techElectivesLeft,
    generalWritingMet,
    uscpMet,
  } = await flowchartHelper(
    flowchart.flowchartData.termData,
    user.flowchartInformation.catalog
  );

  const interests = user.interestAreas.join(", ");
  const year = user.year;
  return `Required Courses: ${formattedRequiredCourses}\nTech Electives Left: ${techElectivesLeft}\nGeneral Writing Met: ${generalWritingMet}\nUSCP Met: ${uscpMet}\nYear: ${year}\nInterests: ${interests}\n${message}`;
};

export const courseCatalogAssistant = async (
  user: UserData,
  message: string
): Promise<string> => {
  const courseIds = await searchCourses(message, null, 5);
  const courseObjects = await getCourseInfo(courseIds);
  const courseDescriptions = JSON.stringify(courseObjects);
  return `Search Results: ${courseDescriptions}\n${message}`;
};

export const calpolyClubsAssistant = (
  user: UserData,
  message: string
): string => {
  const interests = user.interestAreas.join(", ");
  const preferredActivities = user.preferredActivities.join(", ");
  const goals = user.goals.join(", ");
  const major = user.flowchartInformation.major;
  const demographic = JSON.stringify(user.demographic);
  return `Interests: ${interests}\nPreferred Activities: ${preferredActivities}\nMajor: ${major}\nGoals: ${goals}\nDemographic: ${demographic}\n${message}`;
};
