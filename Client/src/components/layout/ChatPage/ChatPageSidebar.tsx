import { useEffect, useRef } from "react";
import { logActions, useAppDispatch, useAppSelector } from "@/redux";

// Hooks
import useMobile from "@/hooks/use-mobile";

// My components
import ChatLogList from "@/components/chatLog/ChatLogList";
import MobileHeader from "@/components/layout/MobileHeader";

// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import useDeviceType from "@/hooks/useDeviceType";

export function ChatPageSidebar() {
  const isMobile = useMobile();
  const deviceType = useDeviceType();

  const dispatch = useAppDispatch();
  const logList = useAppSelector((state) => state.log.logList);
  const userId = useAppSelector((state) => state.auth.userId);

  const hasFetchedLogs = useRef(false);
  const { open } = useSidebar();

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
          {isMobile || deviceType !== "desktop" ? (
            <MobileHeader />
          ) : (
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold leading-tight mt-4">
                Chat Logs
              </h1>
            </div>
          )}
        </SidebarHeader>
        <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
          <ScrollArea className="h-full">
            <SidebarGroup>
              <SidebarMenu>
                <ChatLogList />
              </SidebarMenu>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
