import React from "react";
import { MdClose } from "react-icons/md"; // Importing the close icon
import ChatLog from "../chat/ChatLog";
import UserMenu from "@/components/userProfile/UserMenu";
// Redux:
import { useSelector, useDispatch } from "react-redux";
import {
  toggleSidebar as toggleReduxSidebar,
  setCurrentChatId as setReduxCurrentChatId,
} from "../../redux/ui/uiSlice";
import { setMsgList as msgReduxSetList } from "../../redux/message/messageSlice";

const Sidebar = () => {
  // Redux:
  const dispatch = useDispatch();
  const isSidebarVisible = useSelector((state) => state.ui.isSidebarVisible);
  const logList = useSelector((state) => state.message.logList);

  // Added transition classes and conditional translate classes
  const sidebarClasses = `fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 z-40 overflow-y-auto shadow-lg p-4 transition-transform duration-300 ease-in-out ${
    isSidebarVisible ? "translate-x-0" : "-translate-x-full"
  }`;

  // Handler for selecting a log to view
  const handleSelectLog = (logId) => {
    const chosenLog = logList.find((item) => item.id === logId);
    // Set the content for the msgList
    dispatch(msgReduxSetList(chosenLog.content));
    // Set the current chat id
    dispatch(setReduxCurrentChatId(logId));
    dispatch(toggleReduxSidebar(false)); // close slidebar
  };

  return (
    <aside className={sidebarClasses}>
      <div className="text-gray-700 dark:text-white">
        <button
          onClick={() => dispatch(toggleReduxSidebar(false))}
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
        <div className="flex-grow">
          <h2 className="font-semibold text-xl">Chat Logs</h2>
          {logList.length > 0 ? (
            logList.map((log) => (
              <ChatLog key={log.id} log={log} onSelectLog={handleSelectLog} />
            ))
          ) : (
            <div>No chat logs available</div> // This is just an example placeholder
          )}
        </div>
      </div>

      <div className="">
        {" "}
        {/* New wrapper for UserMenu */}
        <UserMenu />
      </div>
    </aside>
  );
};

export default Sidebar;
