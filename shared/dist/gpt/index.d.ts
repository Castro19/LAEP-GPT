import { ModelType } from "../message";
export type GptType = {
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
    gptList: GptType[];
    currentModel: ModelType;
    isLoading: boolean;
    error: string | null;
    lastCreatedGpt?: string;
};
export type CurrentModelType = "General Assistant" | "Ethics Assistant" | "Social Justice Assistant" | "Enhanced ESJ Assistant" | "Matching Assistant";
export type GptTypeDB = GptType & {
    _id: string;
};
