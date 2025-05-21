import { ToolCall } from "../SBChatMessage";

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

export default renderToolName;
