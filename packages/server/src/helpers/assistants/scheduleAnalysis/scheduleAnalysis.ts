import { ScheduleBuilderObject } from "@polylink/shared/types";
import {
  professorInsights,
  scheduleAnalysis as scheduleAnalysisHelper,
  scheduleReview,
  sectionOptimization,
} from "./helpers/queryType";

/**
 *
 * @param messageToAdd
 * @param jsonObject
 * @returns messageToAdd with schedule or professors added
 */
async function scheduleAnalysis(
  messageToAdd: string,
  jsonObject: ScheduleBuilderObject
): Promise<string> {
  if (jsonObject.queryType === "schedule_review") {
    console.log("FOUND SCHEDULE REVIEW");
    messageToAdd = await scheduleReview(messageToAdd, jsonObject);
  } else if (jsonObject.queryType === "professor_insights") {
    console.log("FOUND PROFESSOR INSIGHTS");
    messageToAdd = await professorInsights(messageToAdd, jsonObject);
  } else if (jsonObject.queryType === "schedule_analysis") {
    console.log("FOUND SCHEDULE ANALYSIS");
    messageToAdd = await scheduleAnalysisHelper(messageToAdd, jsonObject);
  } else if (jsonObject.queryType === "section_optimization") {
    console.log("FOUND SECTION OPTIMIZATION");
    messageToAdd = await sectionOptimization(messageToAdd, jsonObject);
  } else {
    console.log("NOT FOUND");
  }
  console.log("Message to add: ", messageToAdd);
  return messageToAdd;
}

export default scheduleAnalysis;
