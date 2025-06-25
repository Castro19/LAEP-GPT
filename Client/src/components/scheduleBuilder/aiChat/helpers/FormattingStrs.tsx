import React from "react";
// Helpers
import { environment } from "@/helpers/getEnvironmentVars";
// My components:
import { FormattedChatMessage } from "@/components/scheduleBuilder/aiChat";
// Types
import { ToolCall } from "@/components/scheduleBuilder/aiChat/messages/SBChatMessage";
// My components:

/**
 * FormattingStrs - Helper functions for formatting tool calls and messages in AI chat
 *
 * This module provides utility functions for formatting tool call arguments,
 * rendering tool names, and creating formatted message components for the
 * schedule builder AI chat interface.
 *
 * @module
 *
 * @example
 * ```tsx
 * import { renderToolName, FetchSectionsMessage } from './FormattingStrs';
 *
 * const toolName = renderToolName(toolCall);
 * <FetchSectionsMessage fetch_type="search" search_query="CSC 101" />
 * ```
 *
 * @dependencies
 * - FormattedChatMessage for message rendering
 * - Environment variables for development logging
 * - React for component rendering
 *
 * @features
 * - Tool name rendering based on tool type and arguments
 * - Operation message formatting for schedule management
 * - Fetch sections message formatting
 * - Type-safe argument handling
 * - Development environment logging
 *
 * @toolTypes
 * - manage_schedule: Schedule management operations
 * - fetch_sections: Section fetching operations
 * - Generic tool calls: Fallback handling
 *
 * @operations
 * - readall: Reading current schedule
 * - add: Adding sections to schedule
 * - remove: Removing sections from schedule
 *
 * @fetchTypes
 * - search: Course search operations
 * - alternate: Alternate section fetching
 * - curriculum: Curriculum-based section fetching
 *
 * @exports
 * - renderToolName: Formats tool names for display
 * - renderOperation: Formats operation messages
 * - OperationMessage: React component for operation display
 * - renderFetchType: Formats fetch operation messages
 * - FetchSectionsMessage: React component for fetch display
 * - renderToolMessage: Generic tool message formatter
 * - Type definitions for all argument types
 */

/**
 * Renders a human-readable tool name based on tool type and arguments
 *
 * @param {ToolCall} tool - The tool call object to format
 * @returns {string} Formatted tool name for display
 *
 * @example
 * ```tsx
 * const name = renderToolName({
 *   name: "manage_schedule",
 *   args: { operation: "add" }
 * });
 * // Returns: "Adding sections"
 * ```
 */
const renderToolName = (tool: ToolCall) => {
  if (tool.name === "manage_schedule") {
    if (tool.args.operation === "readall") {
      return "Reading schedule";
    } else if (tool.args.operation === "add") {
      return "Adding sections";
    } else if (tool.args.operation === "remove") {
      return "Removing sections";
    }
  } else if (tool.name === "fetch_sections") {
    if (tool.args.fetch_type === "search") {
      return "Searching for courses";
    } else if (tool.args.fetch_type === "alternate") {
      return "Fetching alternate sections";
    } else if (tool.args.fetch_type === "curriculum") {
      return "Fetching sections from flowchart";
    }
  } else {
    return tool.name;
  }
};

interface OperationArgs {
  operation: "add" | "remove" | "readall";
  class_nums?: number[];
  state: {
    term: string;
  };
  formattedCourses: string;
}

const renderOperation = (args: OperationArgs) => {
  switch (args.operation) {
    case "add":
      return `**Added sections:**\n${args.class_nums?.join(", ") || "No sections added"}`;
    case "remove":
      return `**Removed sections:**\n${args.class_nums?.join(", ") || "No sections removed"}`;
    case "readall":
      return `**Reading Schedule for ${args.state.term}**\n\nClasses: ${args.formattedCourses || args.class_nums?.join(", ") || "No classes found"}`;
    default:
      return "";
  }
};

interface OperationMessageProps extends OperationArgs {
  variant?: string;
}

const OperationMessage: React.FC<OperationMessageProps> = ({
  operation,
  class_nums,
  state,
  formattedCourses,
  variant = "bg-slate-800",
}) => {
  const message = renderOperation({
    operation,
    class_nums,
    state,
    formattedCourses,
  });

  return <FormattedChatMessage msg={message} variant={variant} />;
};

interface FetchSectionsArgs {
  fetch_type: "search" | "alternate" | "curriculum";
  num_courses?: number;
  sections_per_course?: number;
  search_query?: string;
  course_ids?: string[];
}

const renderFetchType = (args: FetchSectionsArgs) => {
  const numCourses = args.num_courses ?? 3;
  switch (args.fetch_type) {
    case "search":
      return `**Search Query:** ${args.search_query || "No query provided"}\n\n**Results:** ${numCourses} courses found`;
    case "curriculum":
      return `**Curriculum Fetch:** Next ${numCourses} eligible courses from flowchart`;
    case "alternate":
      return `**Alternate Sections:** ${args.course_ids?.join(", ") || "No sections provided"}`;
    default:
      return "";
  }
};

interface FetchSectionsMessageProps extends FetchSectionsArgs {
  variant?: string;
}

const FetchSectionsMessage: React.FC<FetchSectionsMessageProps> = ({
  fetch_type,
  num_courses,
  sections_per_course,
  search_query,
  course_ids,
  variant = "bg-slate-800",
}) => {
  const message = renderFetchType({
    fetch_type,
    num_courses,
    sections_per_course,
    search_query,
    course_ids,
  });

  return <FormattedChatMessage msg={message} variant={variant} />;
};

type ToolArgs = OperationArgs | FetchSectionsArgs;

const isOperationArgs = (args: ToolArgs): args is OperationArgs => {
  return "operation" in args;
};

const renderToolMessage = (args: ToolArgs): string => {
  if (environment === "dev") {
    console.log("ARGS: ", args);
  }
  if (isOperationArgs(args)) {
    return renderOperation(args);
  } else {
    return renderFetchType(args);
  }
};

export {
  renderToolName,
  renderOperation,
  OperationMessage,
  type OperationArgs,
  renderFetchType,
  FetchSectionsMessage,
  type FetchSectionsArgs,
  renderToolMessage,
  type ToolArgs,
};
