import { useNavigate } from "react-router-dom";
// Redux
import { useAppSelector, useAppDispatch, messageActions } from "@/redux";
import DeleteLog from "./deleteLog/DeleteLog";
import { LogData } from "@/types";
import { SidebarMenuButton } from "../ui/sidebar";

type ChatLogSidebarProps = {
  log: LogData;
  // eslint-disable-next-line no-unused-vars
  onSelectLog: (logId: string) => void;
};

const ChatLogSidebar = ({ log, onSelectLog }: ChatLogSidebarProps) => {
  const navigate = useNavigate();

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
    <div className="flex align-center justify-between mb-1 pb-1 border-b border-gray-500 dark:border-gray-700">
      <SidebarMenuButton
        onClick={() => handleNewLog(log.id)}
        className="w-full"
      >
        {/* <DeleteLog logId={log.id} /> */}
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {log.title}
        </h3>
        {/* <p className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(log.timestamp).toLocaleString()}
        </p> */}
      </SidebarMenuButton>
    </div>
  );
};

export default ChatLogSidebar;
