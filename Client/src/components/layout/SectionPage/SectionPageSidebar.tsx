import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";

import { Calendar, Search, Star, MessageSquare } from "lucide-react";

import { Droppable } from "@hello-pangea/dnd";
import DraggableComponent from "@/components/section/sidebar/DraggableComponent";

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
  const { open } = useSidebar();
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
                  <DraggableComponent
                    item={item}
                    index={index}
                    key={item.title}
                  />
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
