import React, { useEffect } from "react";
import { MdClose } from "react-icons/md"; // Importing the close icon
import ChatLog from "./chat/ChatLog";
import { useUI } from "./contexts/UIContext";
import { useMessage } from "./contexts/MessageContext";
import { archiveChatSession } from "../utils/createLog";

const Sidebar = () => {
  // Context State Vars:
  const {
    currentChatId,
    setCurrentChatId,
    isSidebarVisible,
    setIsSidebarVisible,
  } = useUI();
  const { msgList, logList, setLogList } = useMessage();

  // Added transition classes and conditional translate classes
  // CSS classes that creates the smooth transition
  const sidebarClasses = `fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 z-40 overflow-y-auto shadow-lg p-4 transition-transform duration-300 ease-in-out ${
    isSidebarVisible ? "translate-x-0" : "-translate-x-full"
  }`;

  // Handler for selecting a log to view
  const handleSelectLog = (logId) => {
    archiveChatSession(msgList, currentChatId, logList, setLogList);

    setCurrentChatId(logId);
    setIsSidebarVisible(false); // Optionally close the sidebar upon selection
  };

  return (
    <aside className={sidebarClasses}>
      <div className="text-gray-700 dark:text-white">
        <button
          onClick={() => setIsSidebarVisible(false)}
          className="
            absolute top-4 right-4
            p-2
            rounded-full
            bg-gray-200 dark:bg-gray-700
            text-gray-600 dark:text-gray-300
            hover:bg-gray-300 dark:hover:bg-gray-600
            focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 text-xl
          "
          aria-label="Close sidebar"
        >
          <MdClose />
        </button>
        <h2 className="font-semibold text-xl">Chat Logs</h2>
        {logList.length > 0 ? (
          logList.map((log) => (
            <ChatLog key={log.id} log={log} onSelectLog={handleSelectLog} />
          ))
        ) : (
          <div>No chat logs available</div> // This is just an example placeholder
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
