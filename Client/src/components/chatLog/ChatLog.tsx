import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useAppSelector, useAppDispatch } from "@/redux";
import { messageActions } from "@/redux";
import DeleteLog from "./deleteLog/DeleteLog";
import { LogData } from "@/types";

type ChatLogProps = {
  log: LogData;
  // eslint-disable-next-line no-unused-vars
  onSelectLog: (logId: string) => void;
};

const ChatLog = ({ log, onSelectLog }: ChatLogProps) => {
  // Assuming useMessage and useUI contexts are correctly set up and utilized here
  const navigate = useNavigate();
  const { userId } = useAuth();
  // Redux:
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.message.error); // Access the error state from Redux

  const handleNewLog = async (logId: string) => {
    onSelectLog(logId);
    navigate(`/${userId}/chat/${logId}}`);
    if (error) {
      dispatch(messageActions.clearError()); // Clear error when user starts typing
    }
  };
  return (
    <div className="flex align-center justify-between mb-1 pb-1 border-b border-gray-500 dark:border-gray-700">
      <DeleteLog logId={log.id} />
      <button
        onClick={() => handleNewLog(log.id)}
        className="
          block
          w-full
          px-4 py-2
          my-1 mx-0
          cursor-pointer
          rounded-lg
          bg-gray-100 dark:bg-gray-800
          hover:bg-blue-100 dark:hover:bg-gray-700
          text-left
          transition-colors
          shadow-sm
        "
      >
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {log.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(log.timestamp).toLocaleString()}
        </p>
      </button>
    </div>
  );
};

export default ChatLog;
