import { ScheduleBuilderObject } from "@polylink/shared/types";
import {
  professorInsights,
  scheduleAnalysis as scheduleAnalysisHelper,
  scheduleReview,
  sectionOptimization,
} from "./helpers/queryType";
import { environment } from "../../..";

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
    if (environment === "dev") {
      console.log("FOUND SCHEDULE REVIEW");
    }
    messageToAdd = await scheduleReview(messageToAdd, jsonObject);
  } else if (jsonObject.queryType === "professor_insights") {
    if (environment === "dev") {
      console.log("FOUND PROFESSOR INSIGHTS");
    }
    messageToAdd = await professorInsights(messageToAdd, jsonObject);
  } else if (jsonObject.queryType === "schedule_analysis") {
    if (environment === "dev") {
      console.log("FOUND SCHEDULE ANALYSIS");
    }
    messageToAdd = await scheduleAnalysisHelper(messageToAdd, jsonObject);
  } else if (jsonObject.queryType === "section_optimization") {
    if (environment === "dev") {
      console.log("FOUND SECTION OPTIMIZATION");
    }
    messageToAdd = await sectionOptimization(messageToAdd, jsonObject);
  } else {
    if (environment === "dev") {
      console.log("NOT FOUND");
    }
  }
  if (environment === "dev") {
    console.log("Message to add: ", messageToAdd);
  }
  return messageToAdd;
}

export default scheduleAnalysis;
