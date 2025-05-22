import React, { useState } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import SBFetchSections from "./SBFetchSections";
import SBManageSchedule from "./SBManageSchedule";
import AIChatLoadingMessage from "./AIChatLoadingMessage";
import FormattedChatMessage from "./FormattedChatMessage";

/* -------------------------------------------------------------------------
   📑  Types (replace with shared types when available)
---------------------------------------------------------------------------*/
export interface SBMessage {
  msg_id: string;
  role: "user" | "assistant";
  msg: string;
  thinkingState?: boolean;
  tools?: Tool[];
  tool_calls?: ToolCall[];
  toolMessages?: ToolMsg[];
  isPending?: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  type: string;
}

export interface ToolMsg {
  msg_id: string;
  msg: string;
}

export interface Tool {
  call: ToolCall;
  message: ToolMsg;
}

export interface FetchSectionsArgs {
  fetch_type: "search" | "alternate" | "curriculum";
  num_courses?: number;
  sections_per_course?: number;
  search_query?: string;
}

export interface ManageScheduleArgs {
  operation: "readall" | "add" | "remove";
  class_nums?: number[];
  state: {
    user_id: string;
    schedule_id: string;
    term: string;
    preferences?: Record<string, unknown>;
  };
  formattedCourses: string;
}

/* -------------------------------------------------------------------------
   💬  Component
---------------------------------------------------------------------------*/
interface Props {
  msg: SBMessage;
}

const SBChatMessage: React.FC<Props> = ({ msg }) => {
  const isUser = msg.role === "user";
  const hasTools = !!(msg.tools?.length || msg.tool_calls?.length);
  const [open, setOpen] = useState(true);

  // Convert old format to new format if needed
  const tools =
    msg.tools ||
    msg.tool_calls?.map((call, index) => ({
      call,
      message: msg.toolMessages?.[index] || { msg_id: call.id, msg: "" },
    })) ||
    [];

  const variant = isUser
    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-right"
    : "bg-gradient-to-r from-gray-800 to-gray-700 text-white text-left";

  const renderToolContent = (tool: Tool) => {
    switch (tool.call.name) {
      case "fetch_sections":
        return (
          <SBFetchSections
            args={tool.call.args as unknown as FetchSectionsArgs}
            message={tool.message.msg}
          />
        );
      case "manage_schedule":
        return (
          <SBManageSchedule
            args={tool.call.args as unknown as ManageScheduleArgs}
            message={tool.message.msg}
          />
        );
      default:
        return (
          <>
            <div className="max-w-full overflow-x-auto">
              <pre className="min-w-max whitespace-pre text-slate-300">
                {JSON.stringify(tool.call.args, null, 2)}
              </pre>
            </div>
            <div className="max-w-full overflow-x-auto">
              <pre className="min-w-max bg-slate-800 p-2 rounded text-slate-200 whitespace-pre">
                {tool.message.msg}
              </pre>
            </div>
          </>
        );
    }
  };

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

  return (
    <div className={`my-4 max-w-full ${isUser ? "ml-auto" : "mr-auto"}`}>
      <div className="flex flex-col w-full">
        {/* Main bubble */}
        {msg.isPending ? (
          <AIChatLoadingMessage toolUsage={msg.tool_calls} msg={msg.msg} />
        ) : (
          <FormattedChatMessage msg={msg.msg} variant={variant} />
        )}

        {/* Dropdown for tool calls (assistant only) */}
        {!isUser && hasTools && (
          <div className="mt-2">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white focus:outline-none"
            >
              <ChevronDown
                className={`h-3 w-3 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
              />
              Tool details
            </button>

            {open && (
              <Accordion
                type="multiple"
                className="mt-2 border border-slate-700/60 rounded-md overflow-hidden"
                defaultValue={tools.map((tool) => tool.call.id)}
              >
                {tools.map((tool) => (
                  <AccordionItem
                    key={tool.call.id}
                    value={tool.call.id}
                    className="border-b border-slate-700/60"
                  >
                    <AccordionTrigger className="px-3 py-2 text-left text-sm font-medium bg-slate-800 hover:bg-slate-700">
                      {renderToolName(tool.call)}
                    </AccordionTrigger>
                    <AccordionContent className="bg-slate-900 px-3 py-2 text-xs space-y-3">
                      {renderToolContent(tool)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SBChatMessage;
