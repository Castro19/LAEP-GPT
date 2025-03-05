import {
  ScheduleBuilderObject,
  ScheduleBuilderSection,
} from "@polylink/shared/types";
import scheduleBuilder from "./scheduleBuilder";
import scheduleAnalysisHelperAssistant from "./scheduleAnalysisHelperAssistant";
import { ScheduleAnalysisHelperResponse } from "./scheduleAnalysisHelperAssistant";
import { environment } from "../../..";

/**
 * Handles the Schedule Analysis flow.
 * - Appends schedule sections to the message.
 * - Calls the schedule helper assistant.
 * - Processes its JSON response using scheduleBuilder.
 * - Returns the updated message.
 */
async function handleScheduleBuilderFlow(
  message: string,
  sections?: ScheduleBuilderSection[]
): Promise<string> {
  let messageToAdd = message + "\n";
  messageToAdd +=
    "Here are my current schedule sections: " + JSON.stringify(sections);
  if (environment === "dev") {
    console.log("Message to add for Schedule Analysis:", messageToAdd);
  }

  const helperResponse: ScheduleAnalysisHelperResponse | null =
    await scheduleAnalysisHelperAssistant(messageToAdd);
  if (!helperResponse) {
    throw new Error("Helper response is empty for Schedule Analysis");
  }

  // Convert and parse the helper response into the expected JSON object.
  const helperResponseString = JSON.stringify(helperResponse);
  const jsonObject = JSON.parse(helperResponseString) as ScheduleBuilderObject;
  if (!jsonObject) {
    throw new Error(
      "JSON object not found in Schedule Analysis helper response"
    );
  }
  if (!sections) {
    throw new Error("Sections not provided for Schedule Analysis");
  }

  // Update the message using the scheduleBuilder helper function.
  const updatedMessage = await scheduleBuilder(messageToAdd, jsonObject);
  return updatedMessage;
}

export default handleScheduleBuilderFlow;
