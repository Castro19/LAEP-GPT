import { useEffect, useRef, useState } from "react";
import { logActions, useAppDispatch, useAppSelector } from "@/redux";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

// My components
import ChatLogList from "@/components/chatLog/ChatLogList";
import MobileHeader from "@/components/layout/dynamicLayouts/MobileHeader";

// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import useDeviceType from "@/hooks/useDeviceType";
import { AssistantType } from "@polylink/shared/types";
import { useNavigate } from "react-router-dom";
import AssistantSelector from "@/components/chat/chatSideBar/AssistantSelector";
import { handleModeSelection } from "@/components/chat/helpers/handleModeSelection";

export function ChatPageSidebar() {
  const isNarrowScreen = useIsNarrowScreen();
  const deviceType = useDeviceType();
  const navigate = useNavigate();
  const error = useAppSelector((state) => state.message.error);
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);

  // Track initial fetch
  const hasFetchedLogs = useRef(false);
  // Ref for the scroll area viewport
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // Track the loading status to prevent duplicate requests
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { open, setOpenMobile } = useSidebar();

  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );

  // Get log state for pagination
  const { currentPage, hasMoreLogs, isLoading, logList } = useAppSelector(
    (state) => state.log
  );

  // Update local loading state when Redux loading state changes
  useEffect(() => {
    if (!isLoading) {
      setIsLoadingMore(false);
    }
  }, [isLoading]);

  // Handle scroll event to load more logs
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMoreLogs || isLoading || isLoadingMore) return;

    const target = e.target as HTMLDivElement;
    // If we're near the bottom (within 200px), load more logs
    const isNearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 200;

    if (isNearBottom) {
      setIsLoadingMore(true);
      // Use setTimeout to prevent multiple rapid requests
      setTimeout(() => {
        dispatch(logActions.fetchLogs(currentPage + 1));
      }, 200);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (hasFetchedLogs.current) return;
    hasFetchedLogs.current = true;

    // Only fetch logs if userId is not null (user is signed in)
    if (userId) {
      // Reset pagination state before fetching first page
      dispatch(logActions.resetLogPagination());
      dispatch(logActions.fetchLogs(1)); // Fetch first page
    }
  }, [dispatch, userId]);

  const handleModelSelect = (model: AssistantType) => {
    // Close sidebar if on mobile
    if (isNarrowScreen || deviceType !== "desktop") {
      setOpenMobile(false);
    }

    handleModeSelection(
      model,
      dispatch,
      navigate,
      currentChatId,
      error,
      loading,
      messagesByChatId
    );
  };

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
          {isNarrowScreen || deviceType !== "desktop" ? (
            <MobileHeader />
          ) : (
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold leading-tight mt-4">
                Chat Logs
              </h1>
            </div>
          )}
        </SidebarHeader>
        <SidebarContent
          className="border-b border-sidebar-border overflow-x-hidden"
          onScroll={handleScroll}
        >
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <SidebarGroup>
              <SidebarGroupLabel>Assistants</SidebarGroupLabel>
              <SidebarMenu>
                <AssistantSelector onSelect={handleModelSelect} />
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarGroupLabel>Chat Logs</SidebarGroupLabel>
                <ChatLogList />
                {/* Loading indicator at the bottom */}
                {hasMoreLogs && logList.length > 0 && (
                  <div className="py-4 w-full flex items-center justify-center">
                    {isLoading ? (
                      <div className="text-sm text-gray-500">
                        Loading logs...
                      </div>
                    ) : (
                      <div className="h-4 w-full"></div>
                    )}
                  </div>
                )}
                {!hasMoreLogs && logList.length > 0 && !isLoading && (
                  <div className="text-sm text-gray-500 py-2 text-center">
                    End of logs
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
