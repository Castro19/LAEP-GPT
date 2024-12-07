import { ModelType } from "../message";
export type AssistantType = {
  _id?: string;
  id: string;
  title: string;
  prompt: string;
  assistantId?: string;
  desc: string;
  urlPhoto?: string;
  suggestedQuestions: string[];
};
export type GptSliceType = {
  gptList: AssistantType[];
  currentModel: ModelType;
  isLoading: boolean;
  error: string | null;
  lastCreatedGpt?: string;
};
export type CurrentModelType =
  | "General Assistant"
  | "Ethics Assistant"
  | "Social Justice Assistant"
  | "Enhanced ESJ Assistant"
  | "Matching Assistant";
export type AssistantTypeDB = AssistantType & {
  _id: string;
};
