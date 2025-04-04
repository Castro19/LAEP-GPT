import { useEffect, useRef } from "react";
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
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import useDeviceType from "@/hooks/useDeviceType";
import { AssistantType } from "@polylink/shared/types";
import { useNavigate } from "react-router-dom";
import AssistantSelector from "@/components/chat/chatSideBar/AssistantSelector";
import { handleModeSelection } from "@/components/layout/ChatPage/ChatPageHeader";

export function ChatPageSidebar() {
  const isNarrowScreen = useIsNarrowScreen();
  const deviceType = useDeviceType();

  const navigate = useNavigate();
  const error = useAppSelector((state) => state.message.error);


  const dispatch = useAppDispatch();
  const logList = useAppSelector((state) => state.log.logList);
  const userId = useAppSelector((state) => state.auth.userId);

  const hasFetchedLogs = useRef(false);
  const { open, setOpenMobile } = useSidebar();

  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );

  useEffect(() => {
    if (hasFetchedLogs.current || logList.length > 0) return;
    hasFetchedLogs.current = true;
    // Only fetch logs if userId is not null (user is signed in)
    if (userId) {
      dispatch(logActions.fetchLogs());
    }
  }, [dispatch, userId, logList.length]);

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
              <SidebarMenu>
                <AssistantSelector onSelect={handleModelSelect} />
              </SidebarMenu>
            </SidebarGroup>
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
