import { useEffect, useRef } from "react";
import styles from "./Sidebar.module.css";
import { MdClose } from "react-icons/md"; // Importing the close icon
import ChatLog from "../../chatLog/ChatLog";
import UserMenu from "@/components/userProfile/UserMenu";
// Redux:
import {
  useAppSelector,
  useAppDispatch,
  messageActions,
  logActions,
  layoutActions,
} from "@/redux";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  // Redux:
  const dispatch = useAppDispatch();
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );
  const logList = useAppSelector((state) => state.log.logList);
  const userId = useAppSelector((state) => state.auth.userId);

  const hasFetchedLogs = useRef(false);

  useEffect(() => {
    if (hasFetchedLogs.current || logList.length > 0) return;
    hasFetchedLogs.current = true;
    // Only fetch logs if userId is not null (user is signed in)
    if (userId) {
      dispatch(logActions.fetchLogs());
    }
  }, [dispatch, userId, logList.length]);

  // Added transition classes and conditional translate classes
  const sidebarClasses = `fixed top-0 left-0 h-screen w-64 bg-slate-900 z-40 overflow-y-auto shadow-lg p-4 transition-transform duration-300 ease-in-out ${
    isSidebarVisible ? "translate-x-0" : "-translate-x-full"
  } border-r border-zinc-700`;

  // Handler for selecting a log to view
  const handleSelectLog = (logId: string) => {
    const chosenLog = logList.find((item) => item.id === logId);
    if (chosenLog) {
      // Set the current chat id
      dispatch(messageActions.setCurrentChatId(logId));
      dispatch(messageActions.toggleNewChat(false));

      dispatch(layoutActions.toggleSidebar(false)); // close slidebar
    }
  };

  return (
    <aside className={`${sidebarClasses} flex flex-col h-full`}>
      <div className="relative text-gray-700 dark:text-white flex-shrink-0">
        <button
          onClick={() => dispatch(layoutActions.toggleSidebar(false))}
          className="
            absolute  right-4
            p-2
            rounded-full
            bg-zinc-800
            text-gray-600 dark:text-gray-300
            hover:bg-gray-300 dark:hover:bg-gray-600
            focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 text-xl
          "
          aria-label="Close sidebar"
        >
          <MdClose />
        </button>
        <div className="border-b-2 border-zinc-800 pb-4">
          <Button
            className="text-2xl"
            variant="link"
            onClick={() => navigate("/")}
          >
            PolyLink
          </Button>
        </div>
      </div>
      <div
        className={`flex-grow overflow-y-auto overflow-x-hidden scroll-smooth ${styles.customScrollbar}`}
      >
        {logList.length > 0 ? (
          logList.map((log) => (
            <ChatLog key={log.id} log={log} onSelectLog={handleSelectLog} />
          ))
        ) : (
          <div>No chat logs available</div>
        )}
      </div>
      <div className="relative border-t-2 border-gray-200 dark:border-gray-500 box-shadow p-4">
        <UserMenu />
      </div>
    </aside>
  );
};

export default Sidebar;
