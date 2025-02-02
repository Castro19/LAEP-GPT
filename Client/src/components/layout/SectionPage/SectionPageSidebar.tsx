import { ChatContainer } from "@/components/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import ModeDropDown from "@/components/chat/ModeDropDown";
import { layoutActions, useAppDispatch, useAppSelector } from "@/redux";
import { assistantActions } from "@/redux";
import { onNewChat } from "@/components/chat/helpers/newChatHandler";
import { AssistantType } from "@polylink/shared/types";
import { useNavigate } from "react-router-dom";
import SectionFilters from "@/components/section/SectionFilters";
import { Calendar, Search, Star, MessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Draggable, Droppable } from "@hello-pangea/dnd";

// Menu items.
const ITEMS = [
  {
    title: "Class Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Weekly Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Ratings",
    url: "#",
    icon: Star,
  },
  {
    title: "AI Chat",
    url: "#",
    icon: MessageSquare,
  },
];

const SectionPageSidebar = () => {
  const dispatch = useAppDispatch();
  const { open } = useSidebar();
  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );
  const error = useAppSelector((state) => state.message.error);
  const navigate = useNavigate();

  const handleModeSelection = (model: AssistantType) => {
    if (model && model.id) {
      const modelId = model.id;
      dispatch(assistantActions.setCurrentAssistant(modelId));
      dispatch(layoutActions.toggleDropdown(false));
      onNewChat(
        currentChatId,
        dispatch,
        navigate,
        error,
        loading,
        messagesByChatId,
        true
      );
    }
  };

  return (
    <Sidebar
      className="flex flex-col h-full"
      side="left"
      variant="inset"
      collapsible="icon"
    >
      <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {!open && (
          <Droppable droppableId="sidebar-menu">
            {(provided) => (
              <SidebarMenu ref={provided.innerRef} {...provided.droppableProps}>
                {ITEMS.map((item, index) => (
                  <Draggable
                    draggableId={item.title}
                    index={index}
                    key={item.title}
                  >
                    {(provided) => (
                      <SidebarMenuItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <SidebarMenuButton asChild>
                          <div className="flex items-center gap-8">
                            <item.icon />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>{item.title}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{item.title}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </SidebarMenu>
            )}
          </Droppable>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default SectionPageSidebar;
{
  /* <ScrollArea className="h-full">
{/* <ChatContainer /> */
}
