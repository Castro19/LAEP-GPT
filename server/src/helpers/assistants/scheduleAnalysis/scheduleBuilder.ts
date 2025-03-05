import { ScheduleBuilderObject } from "@polylink/shared/types";
import {
  professorInsights,
  scheduleAnalysis,
  scheduleReview,
  sectionOptimization,
} from "./helpers/queryType";

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
  if (jsonObject.queryType === "schedule_review") {
    messageToAdd = await scheduleReview(messageToAdd, jsonObject);
  } else if (jsonObject.queryType === "professor_insights") {
    messageToAdd = await professorInsights(messageToAdd, jsonObject);
  } else if (jsonObject.queryType === "schedule_analysis") {
    messageToAdd = await scheduleAnalysis(messageToAdd, jsonObject);
  } else if (jsonObject.queryType === "section_optimization") {
    messageToAdd = await sectionOptimization(messageToAdd, jsonObject);
  }
  return messageToAdd;
}

export default scheduleBuilder;
