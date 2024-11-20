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
import ChatLogSidebar from "@/components/chatLog/ChatLogSidebar";
import {
  layoutActions,
  logActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { messageActions } from "@/redux";
import { useEffect, useRef } from "react";

export function ChatPageSidebar() {
  const dispatch = useAppDispatch();
  const logList = useAppSelector((state) => state.log.logList);
  const userId = useAppSelector((state) => state.auth.userId);
  const hasFetchedLogs = useRef(false);

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
      <SidebarHeader className="mt-4 border-b border-sidebar-border flex-none">
        <Button
          className="text-2xl"
          variant="link"
          onClick={() => navigate("/")}
        >
          PolyLink
        </Button>
      </SidebarHeader>
      <SidebarContent className="border-b border-sidebar-border flex-1 overflow-x-hidden m-4">
        <SidebarGroupLabel>Chatlogs</SidebarGroupLabel>
        <SidebarGroup>
          <SidebarMenu>
            {logList.length > 0 ? (
              logList.map((log) => (
                <ChatLogSidebar
                  key={log.id}
                  log={log}
                  onSelectLog={handleSelectLog}
                />
              ))
            ) : (
              <div>No chat logs available</div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
