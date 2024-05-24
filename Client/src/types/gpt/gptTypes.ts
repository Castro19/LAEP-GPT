import { ModelType } from "../message/messageType";

export type GptType = {
  userId?: string;
  id?: string;
  title: string;
  desc: string;
  urlPhoto?: string;
  instructions?: string;
};

export interface GptSliceType {
  gptList: GptType[];
  currentModel: ModelType;
}
