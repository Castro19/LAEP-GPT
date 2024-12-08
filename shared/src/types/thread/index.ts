export type ThreadData = {
  threadId: string;
  vectorStoreId: string | null;
  assistantId?: string; // TO-DO: Eventually make this required (only optional for now for backwards compatibility)
};

export type ThreadDocument = ThreadData & {
  _id: string;
};
