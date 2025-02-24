import AddSectionSidebar from "@/components/calendar/addSectionSidebar/AddSectionSidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";

const CalendarPageSidebar = () => {
  const { setOpen } = useSidebar();

  return (
    <Sidebar
      className="flex flex-col h-full"
      side="right"
      variant="calendar"
      id="calendar-sidebar"
    >
      <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
        <div className="flex flex-col gap-4">
          <SidebarHeader>
            <SidebarMenuButton variant="default" onClick={() => setOpen(false)}>
              <ChevronLeft />
            </SidebarMenuButton>
          </SidebarHeader>
          <AddSectionSidebar />
        </div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default CalendarPageSidebar;
