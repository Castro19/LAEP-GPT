import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import ChatLog from "@/components/chatLog/ChatLog";
import {
  messageActions,
  layoutActions,
  logActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MobileHeader from "../MobileHeader";
import useMobile from "@/hooks/use-mobile";

export function ChatPageSidebar() {
  const isMobile = useMobile();
  const dispatch = useAppDispatch();
  const logList = useAppSelector((state) => state.log.logList);
  const userId = useAppSelector((state) => state.auth.userId);
  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );
  const hasFetchedLogs = useRef(false);
  const { open } = useSidebar();
  // Handler for selecting a log to view
  const handleSelectLog = (logId: string) => {
    if (currentChatId) {
      if (loading[currentChatId]) {
        // Get the last user message id. It will be the last or 2nd to last message in the array. it will always be the the last message of the array with the type "user"
        const lastMessages = messagesByChatId[currentChatId].content.slice(-2);
        const userMessageId = lastMessages.find(
          (message) => message.sender === "user"
        )?.id;
        if (userMessageId) {
          dispatch(
            messageActions.cancelBotResponse({
              userMessageId: userMessageId,
              chatId: currentChatId,
            })
          );
        }
      }
    }
    const chosenLog = logList.find((item) => item.logId === logId);
    if (chosenLog) {
      // Set the current chat id
      dispatch(messageActions.setCurrentChatId(logId));
      dispatch(messageActions.toggleNewChat(false));

      dispatch(layoutActions.toggleSidebar(false)); // close slidebar
    }
  };

  useEffect(() => {
    if (hasFetchedLogs.current || logList.length > 0) return;
    hasFetchedLogs.current = true;
    // Only fetch logs if userId is not null (user is signed in)
    if (userId) {
      dispatch(logActions.fetchLogs());
    }
  }, [dispatch, userId, logList.length]);

  return (
    <>
      <Sidebar
        collapsible="icon-offcanvas"
        className={`
          flex flex-col h-full ml-16 dark:bg-gray-800
          transition-all duration-300
          ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}
        `}
      >
        <SidebarHeader className="border-b-2 border-sidebar-border dark:border-slate-700 flex-none">
          {isMobile ? (
            <MobileHeader />
          ) : (
            <div className="flex items-center justify-center">
              <h1 className="text-xl font-bold leading-tight">Chat Logs</h1>
            </div>
          )}
        </SidebarHeader>
        <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
          <ScrollArea className="h-full">
            <SidebarGroup>
              <SidebarMenu>
                {logList.length > 0 ? (
                  logList.map((log) => (
                    <ChatLog
                      key={log.logId}
                      log={log}
                      onSelectLog={handleSelectLog}
                    />
                  ))
                ) : (
                  <div>No chat logs available</div>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
