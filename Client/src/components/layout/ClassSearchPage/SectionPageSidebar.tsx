/* eslint-disable no-unused-vars */
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

import { Schedule, Search, Star, MessageSquare } from "lucide-react";

import { Droppable } from "@hello-pangea/dnd";
import DraggableComponent from "@/components/classSearch/sidebar/DraggableComponent";
import { useDispatch } from "react-redux";
import { setCurrentChoice } from "@/redux/panelLayout/panelLayoutSlice";

enum Choice {
  Filters = "filters",
  Calendar = "calendar",
  Reviews = "reviews",
  Chat = "chat",
}

// Menu items.
const ITEMS = [
  {
    title: "Class Filters",
    choice: Choice.Filters,
    url: "#",
    icon: Search,
  },
  {
    title: "Weekly Calendar",
    choice: Choice.Calendar,
    url: "#",
    icon: Schedule,
  },
  {
    title: "Ratings",
    choice: Choice.Reviews,
    url: "#",
    icon: Star,
  },
  {
    title: "AI Chat",
    choice: Choice.Chat,
    url: "#",
    icon: MessageSquare,
  },
];

const SectionPageSidebar = () => {
  const { open } = useSidebar();
  const dispatch = useDispatch();

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
                    <a
                      href={item.url}
                      onClick={() => dispatch(setCurrentChoice(item.choice))}
                    >
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
