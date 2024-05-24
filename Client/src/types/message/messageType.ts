export type ModelType = {
  id?: string;
  title: string;
  desc: string;
  urlPhoto?: string;
  instructions?: string;
};

export type MessageObjType = {
  id: number;
  sender: string;
  text: string;
  model?: string; // User only
  urlPhoto?: string; // Bot only
};

export type SendMessageReturnType = {
  newUserMessage: MessageObjType;
  botMessage: MessageObjType;
  // eslint-disable-next-line no-unused-vars
  updateStream: (
    // eslint-disable-next-line no-unused-vars
    updateCallback: (arg0: number, arg1: string) => void
  ) => Promise<string>;
};

// Important:
export interface MessageSliceType {
  msgList: MessageObjType[];
  isLoading: boolean;
  error: string | null;
}
