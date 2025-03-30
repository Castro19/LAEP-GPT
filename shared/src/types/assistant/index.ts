import { ObjectId } from "bson";

export type AssistantType = {
  id: string; // The unique id of the assistant
  title: string; // the title of the assistant
  instructions?: string; // the instructions of the assistant
  assistantId?: string; // The unique id of the assistant
  desc: string; // the displayed description of the assistant
  urlPhoto?: string; // The avatar image of the assistant
  suggestedQuestions?: string[]; // The suggested questions for the assistant
  inTestMode?: boolean;
};

export type AssistantSliceType = {
  assistantList: AssistantType[]; // The list of assistants fetched from DB
  currentModel: AssistantType; // The current assistant Model selected
  isLoading: boolean; // Is being created
  error: string | null; // Error when submitting form to create assistant
  lastCreatedGpt?: string; // The assistant that was created last (used to undo the creatinon)
};

export type AssistantDocument = AssistantType & {
  _id: ObjectId;
};
