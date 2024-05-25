/* eslint-disable no-unused-vars */
// Define a type for custom error messages
export type CustomErrorType = {
  message: string;
  code?: number;
};

// Example usage for CRUD operations
export enum CrudErrorCodes {
  CREATE_FAILED = "CREATE_FAILED",
  READ_FAILED = "READ_FAILED",
  DELETE_FAILED = "DELETE_FAILED",
}

// Example error messages
export const errorMessages: Record<CrudErrorCodes, CustomErrorType> = {
  [CrudErrorCodes.CREATE_FAILED]: {
    message: "Failed to create GPT.",
    code: 1001,
  },
  [CrudErrorCodes.READ_FAILED]: {
    message: "Failed to read GPT data.",
    code: 1002,
  },
  [CrudErrorCodes.DELETE_FAILED]: {
    message: "Failed to delete GPT.",
    code: 1004,
  },
};
