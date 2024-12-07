import { useNavigate } from "react-router-dom";
// Redux
import { useAppSelector, useAppDispatch, messageActions } from "@/redux";
import { LogData } from "@polylink/shared/types";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import ChatLogOptions from "./ChatLogOptions";
import { useState } from "react";

type ChatLogSidebarProps = {
  log: LogData;
  // eslint-disable-next-line no-unused-vars
  onSelectLog: (logId: string) => void;
};

const ChatLog = ({ log, onSelectLog }: ChatLogSidebarProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState(log.title);
  // Redux:
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.message.error); // Access the error state from Redux

  const handleNewLog = async (logId: string) => {
    onSelectLog(logId);
    navigate(`/chat/${logId}`);
    if (error) {
      dispatch(messageActions.clearError()); // Clear error when user starts typing
    }
  };
  return (
    // Entire rectangle border is needed
    <SidebarMenuItem className="w-11/12 border-b border-sidebar-border">
      <div className="group flex items-center justify-between px-2 py-2.5 mb-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 w-full">
        <SidebarMenuButton
          onClick={() => handleNewLog(log.id)}
          className="flex-1 flex items-center gap-3"
        >
          {/* Title and timestamp */}
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {log.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        </SidebarMenuButton>

        {/* Options button - only visible on hover */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ChatLogOptions log={log} name={name || ""} onNameChange={setName} />
        </div>
      </div>
    </SidebarMenuItem>
  );
};

export default ChatLog;
