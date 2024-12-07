export type ModelType = {
    id?: string;
    title: string;
    desc: string;
    urlPhoto?: string;
    instructions?: string;
    suggestedQuestions?: string[];
};
export type MessageObjType = {
    id: string;
    sender: "bot" | "user";
    text: string;
    model?: string;
    urlPhoto?: string;
    userReaction: "like" | "dislike" | null;
    thinkingState?: boolean;
};
export interface MessageSliceType {
    currentChatId: string | null;
    msg: string;
    isNewChat: boolean;
    msgList: MessageObjType[];
    isLoading: boolean;
    error: string | null;
}
