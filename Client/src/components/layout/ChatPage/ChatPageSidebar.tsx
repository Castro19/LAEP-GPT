import { useEffect, useRef } from "react";
import { logActions, useAppDispatch, useAppSelector } from "@/redux";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

// My components
import ChatLogList from "@/components/chatLog/ChatLogList";
import MobileHeader from "@/components/layout/dynamicLayouts/MobileHeader";
import { Loader2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";

export function ChatPageSidebar() {
  const isNarrowScreen = useIsNarrowScreen();
  const deviceType = useDeviceType();
  const navigate = useNavigate();
  const error = useAppSelector((state) => state.message.error);
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);

  // Track initial fetch
  const hasFetchedLogs = useRef(false);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const { open, setOpenMobile } = useSidebar();

  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );

  // Get log state for pagination
  const { currentPage, hasMoreLogs, isLoading, logList } = useAppSelector(
    (state) => state.log
  );

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (!loadMoreTriggerRef.current || !userId || !hasMoreLogs) return;

    const currentNode = loadMoreTriggerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreLogs && !isLoading) {
          dispatch(logActions.fetchLogs(currentPage + 1));
        }
      },
      { rootMargin: "100px 0px", threshold: 0.1 }
    );

    observer.observe(currentNode);

    return () => {
      observer.unobserve(currentNode);
    };
  }, [dispatch, currentPage, hasMoreLogs, isLoading, userId]);

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
        <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
          <ScrollArea className="h-full">
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
                {/* Loader indicator at the bottom - only show when there are logs */}
                {logList.length > 0 && (
                  <div
                    ref={loadMoreTriggerRef}
                    className="py-4 w-full flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="text-sm text-gray-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    ) : hasMoreLogs ? (
                      <div className="h-8 w-full flex flex-col items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dispatch(logActions.fetchLogs(currentPage + 1))
                          }
                          disabled={isLoading}
                          className="mt-2"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          Load More
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 py-2 text-center"></div>
                    )}
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
