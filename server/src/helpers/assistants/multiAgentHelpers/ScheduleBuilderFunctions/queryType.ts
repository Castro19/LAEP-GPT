import { ScheduleBuilderObject } from "@polylink/shared/types";
import {
  fetchAlternativeSections,
  fetchProfessors,
  fetchSections,
} from "./fetchHandlers";

const scheduleReview = async (
  messageToAdd: string,
  jsonObject: ScheduleBuilderObject
): Promise<string> => {
  if (
    jsonObject.fetchScheduleSections.required &&
    jsonObject.fetchScheduleSections.fields
  ) {
    const sections = await fetchSections(
      jsonObject.fetchScheduleSections.fields,
      jsonObject.fetchScheduleSections.sections
    );
    return (
      "Here is my current schedule sections: " + `${JSON.stringify(sections)}`
    );
  }
  // Else return what we had before
  return messageToAdd;
};

const professorInsights = async (
  messageToAdd: string,
  jsonObject: ScheduleBuilderObject
): Promise<string> => {
  let message = "";
  if (
    jsonObject.fetchScheduleSections.required &&
    jsonObject.fetchScheduleSections.fields
  ) {
    const sections = await fetchSections(
      jsonObject.fetchScheduleSections.fields,
      jsonObject.fetchScheduleSections.sections
    );
    message +=
      "Here is my current schedule sections: " + `${JSON.stringify(sections)}`;
  }

  if (
    jsonObject.fetchProfessors.required &&
    jsonObject.fetchProfessors.fields
  ) {
    const professors = await fetchProfessors(
      jsonObject.fetchProfessors.fields,
      jsonObject.fetchProfessors.sections
    );
    message += `Here are my professors: ${JSON.stringify(professors)}`;
    return message;
  }
  // Else return what we had before
  return messageToAdd;
};

const scheduleAnalysis = async (
  messageToAdd: string,
  jsonObject: ScheduleBuilderObject
): Promise<string> => {
  let message = "";

  if (
    jsonObject.fetchScheduleSections.required &&
    jsonObject.fetchScheduleSections.fields
  ) {
    const sections = await fetchSections(
      jsonObject.fetchScheduleSections.fields,
      jsonObject.fetchScheduleSections.sections
    );
    message +=
      "Here is my current schedule sections: " + `${JSON.stringify(sections)}`;
  }

  if (
    jsonObject.fetchProfessors.required &&
    jsonObject.fetchProfessors.fields
  ) {
    const professors = await fetchProfessors(
      jsonObject.fetchProfessors.fields,
      jsonObject.fetchProfessors.sections
    );
    message += `Here are my professors: ${JSON.stringify(professors)}`;
    return message;
  }
  // Else return what we had before
  return messageToAdd;
};

const sectionOptimization = async (
  messageToAdd: string,
  jsonObject: ScheduleBuilderObject
): Promise<string> => {
  let message = "";
  if (
    jsonObject.fetchAlternativeSections.required &&
    jsonObject.fetchAlternativeSections.fields
  ) {
    const sections = await fetchSections(
      jsonObject.fetchAlternativeSections.fields,
      jsonObject.fetchAlternativeSections.sections
    );
    message +=
      "Here is my current schedule sections: " + `${JSON.stringify(sections)}`;
    const alternativeSections = await fetchAlternativeSections(
      jsonObject.fetchAlternativeSections.fields,
      jsonObject.fetchAlternativeSections.sections
    );
    message +=
      "Here are my alternative sections: " +
      `${JSON.stringify(alternativeSections)}`;
    return message;
  }
  // Else return what we had before
  return messageToAdd;
};

export {
  scheduleReview,
  professorInsights,
  scheduleAnalysis,
  sectionOptimization,
};
