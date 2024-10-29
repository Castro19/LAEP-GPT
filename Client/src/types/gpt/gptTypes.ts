import { ModelType } from "../message/messageType";

export type GptType = {
  userId?: string; // The user who made the assistant
  id?: string; // The unique id of the assistant
  title: string; // the title of the assistant
  desc: string; // the displayed description of the assistant
  urlPhoto?: string; // The avatar image of the assistant
  instructions?: string; // The instructions stored on db for assistant
};

export type GptSliceType = {
  gptList: GptType[]; // The list of assistants fetched from DB
  currentModel: ModelType; // The current assistant Model selected
  isLoading: boolean; // Is being created
  error: string | null; // Error when submitting form to create assistant
  lastCreatedGpt?: string; // The assistant that was created last (used to undo the creatinon)
};

export type CurrentModelType =
  | "Normal"
  | "Ethics Assistant"
  | "Social Justice Assistant"
  | "Enhanced ESJ Assistant"
  | "Matching Assistant";
