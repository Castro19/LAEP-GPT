import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ChatLog from "@/components/chatLog/ChatLog";
import {
  messageActions,
  layoutActions,
  logActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { useEffect, useRef } from "react";
import ChatSidebarFooter from "@/components/chatLog/ChatSidebarFooter";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatPageSidebar() {
  const dispatch = useAppDispatch();
  const logList = useAppSelector((state) => state.log.logList);
  const userId = useAppSelector((state) => state.auth.userId);
  const hasFetchedLogs = useRef(false);

  // Handler for selecting a log to view
  const handleSelectLog = (logId: string) => {
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

  const navigate = useNavigate();
  return (
    <Sidebar className="flex flex-col h-full">
      <SidebarHeader className="mt-4 border-b border-sidebar-border dark:border-slate-700 flex-none">
        <Button
          className="text-2xl"
          variant="link"
          onClick={() => navigate("/")}
        >
          PolyLink
        </Button>
      </SidebarHeader>
      <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
        <ScrollArea className="h-full">
          <SidebarGroupLabel>Chatlogs</SidebarGroupLabel>
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
      <ChatSidebarFooter />
    </Sidebar>
  );
}
