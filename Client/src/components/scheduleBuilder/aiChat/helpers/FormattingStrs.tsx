import React from "react";
import { environment } from "@/helpers/getEnvironmentVars";
import { ToolCall } from "../SBChatMessage";
import FormattedChatMessage from "../FormattedChatMessage";

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
    } else if (tool.args.fetch_type === "user_selected") {
      return "Fetching selected sections";
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
      return `**Added sections:**\n${args.class_nums?.join(", ") || "none"}`;
    case "remove":
      return `**Removed sections:**\n${args.class_nums?.join(", ") || "none"}`;
    case "readall":
      if (environment === "dev") {
        console.log(args.formattedCourses);
      }
      return `**Reading Schedule for ${args.state.term}**\n\nClasses: ${args.formattedCourses || args.class_nums?.join(", ")}`;
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
  fetch_type: "search" | "user_selected" | "curriculum";
  num_courses?: number;
  sections_per_course?: number;
  search_query?: string;
}

const renderFetchType = (args: FetchSectionsArgs) => {
  switch (args.fetch_type) {
    case "search":
      return `**Search Query:** ${args.search_query}\n\n**Results:** ${args.num_courses} courses found`;
    case "curriculum":
      return `**Curriculum Fetch:** Next ${args.num_courses} eligible courses from flowchart`;
    case "user_selected":
      return `**User Selected Sections**`;
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
  variant = "bg-slate-800",
}) => {
  const message = renderFetchType({
    fetch_type,
    num_courses,
    sections_per_course,
    search_query,
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
