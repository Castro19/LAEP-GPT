import React from "react";
import { ToolCall } from "./SBChatMessage";
import { motion } from "framer-motion";

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
  fetch_type: "search" | "alternate" | "curriculum";
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
            return sections_per_course
              ? `Fetching next ${num_courses} eligible courses from the flowchart (max ${sections_per_course} sections per course)`
              : `Fetching next ${num_courses} eligible courses`;
          case "alternate":
            return "Fetching alternate sections";
          default:
            return "Fetching sections";
        }
      }
      default:
        return `Using ${tool.name}`;
    }
  };

  return (
    <div className="text-xs sm:text-sm italic relative overflow-hidden text-slate-400/70 dark:text-slate-400/70 w-full">
      {toolUsage.map((tool, index) => (
        <motion.div
          key={tool.id}
          className="mb-1.5 last:mb-0"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {formatToolMessage(tool)}
        </motion.div>
      ))}
    </div>
  );
};

export default ToolUsageDisplay;
