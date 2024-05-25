/* eslint-disable no-unused-vars */
import { CustomErrorType } from "../gpt/errorTypes";

// Example usage for CRUD operations related to logs
export enum LogErrorCodes {
  CREATE_FAILED = "CREATE_FAILED",
  READ_FAILED = "READ_FAILED",
  UPDATE_FAILED = "UPDATE_FAILED",
  DELETE_FAILED = "DELETE_FAILED",
}

// Example error messages
export const logErrorMessages: Record<LogErrorCodes, CustomErrorType> = {
  [LogErrorCodes.CREATE_FAILED]: {
    message: "Failed to create log.",
    code: 2001,
  },
  [LogErrorCodes.READ_FAILED]: {
    message: "Failed to fetch logs.",
    code: 2002,
  },
  [LogErrorCodes.UPDATE_FAILED]: {
    message: "Failed to update log.",
    code: 2003,
  },
  [LogErrorCodes.DELETE_FAILED]: {
    message: "Failed to delete log.",
    code: 2004,
  },
};
