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
} from "@/components/ui/sidebar";

import { Calendar, Search, Star, MessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Draggable } from "@hello-pangea/dnd";

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
  return (
    <Sidebar
      className="flex flex-col h-full"
      side="left"
      variant="inset"
      collapsible="icon"
    >
      <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
        {ITEMS.map((item) => (
          <Draggable draggableId={item.title} index={0} key={item.title}>
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
