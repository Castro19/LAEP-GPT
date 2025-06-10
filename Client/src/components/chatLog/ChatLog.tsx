/**
 * @component ChatLog
 * @description Individual chat log item displaying chat information and options.
 * Represents a single chat conversation in the sidebar.
 *
 * @props
 * @prop {string} id - Chat log ID
 * @prop {string} title - Chat title
 * @prop {string} assistantName - Name of the assistant
 * @prop {string} assistantAvatar - Assistant's avatar URL
 * @prop {string} lastMessage - Last message in chat
 * @prop {string} lastMessageTime - Timestamp of last message
 * @prop {boolean} isActive - Whether chat is currently selected
 * @prop {Function} onSelect - Function to select this chat
 *
 *
 * @features
 * - Chat information display
 * - Active state indication
 * - Options menu access
 * - Selection handling
 *
 * @dependencies
 * - ChatLogOptions: For chat management
 * - UI Components: Button, Avatar
 *
 * @behavior
 * - Shows chat details
 * - Handles selection
 * - Manages options menu
 * - Updates active state
 *
 * @related
 * Components: ChatLogOptions.tsx
 * - For chat management options
 */

import { useNavigate, useParams } from "react-router-dom";
// Redux
import { useAppSelector, useAppDispatch, messageActions } from "@/redux";
import { LogListType } from "@polylink/shared/types";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import ChatLogOptions from "./ChatLogOptions";

type ChatLogSidebarProps = {
  log: LogListType;
  // eslint-disable-next-line no-unused-vars
  onSelectLog: (logId: string) => void;
};

const ChatLog = ({ log, onSelectLog }: ChatLogSidebarProps) => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const isActive = log.logId === chatId;

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
    // Fixes spacing issue by ensuring consistent padding/margins
    <SidebarMenuItem className="w-full p-1">
      <div
        className={`group flex items-center justify-between w-full h-full px-2 py-1 rounded-lg transition-colors duration-200 ml-0.5 -mt-2
        ${isActive ? "bg-gray-700 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-opacity-70"}`}
      >
        <SidebarMenuButton
          onClick={() => handleNewLog(log.logId)}
          className="flex-1 flex items-center gap-3 h-full hover:bg-transparent active:bg-transparent"
        >
          {/* Title and timestamp */}
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {log.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {new Date(log.timestamp).toLocaleString(undefined, {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </SidebarMenuButton>

        {/* Options button - only visible on hover */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ChatLogOptions log={log} />
        </div>
      </div>
    </SidebarMenuItem>
  );
};

export default ChatLog;
