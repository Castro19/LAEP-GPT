import React from "react";
import { ToolCall } from "./SBChatMessage";

interface ToolUsageDisplayProps {
  toolUsage: ToolCall[];
}

interface ManageScheduleArgs {
  operation: "readall" | "add" | "remove";
  class_nums?: number[];
  state?: {
    user_id: string;
    schedule_id: string;
    term: string;
  };
}

interface FetchSectionsArgs {
  fetch_type: "search" | "user_selected" | "curriculum";
  num_courses?: number;
  sections_per_course?: number;
  search_query?: string;
}

const ToolUsageDisplay: React.FC<ToolUsageDisplayProps> = ({ toolUsage }) => {
  const formatToolMessage = (tool: ToolCall): string => {
    switch (tool.name) {
      case "manage_schedule": {
        const args = tool.args as unknown as ManageScheduleArgs;
        const { operation, class_nums } = args;
        switch (operation) {
          case "add":
            return `Adding ${class_nums?.length || 0} sections to your schedule`;
          case "remove":
            return `Removing ${class_nums?.length || 0} sections from your schedule`;
          case "readall":
            return "Reading your current schedule";
          default:
            return "Managing schedule";
        }
      }
      case "fetch_sections": {
        const args = tool.args as unknown as FetchSectionsArgs;
        const { fetch_type, num_courses, sections_per_course, search_query } =
          args;
        switch (fetch_type) {
          case "search":
            return `Searching for courses matching "${search_query}"`;
          case "curriculum":
            return `Fetching next ${num_courses} eligible courses from flowchart ${
              sections_per_course
                ? `(max ${sections_per_course} sections per course)`
                : ""
            }`;
          case "user_selected":
            return "Fetching your selected sections";
          default:
            return "Fetching sections";
        }
      }
      default:
        return `Using ${tool.name}`;
    }
  };

  return (
    <div className="text-sm sm:text-md italic pt-1 relative overflow-hidden  dark:text-gray-400 text-gray-400 w-full">
      {toolUsage.map((tool) => (
        <div key={tool.id} className="mb-1">
          {formatToolMessage(tool)}
        </div>
      ))}
    </div>
  );
};

export default ToolUsageDisplay;
