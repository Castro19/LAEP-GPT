import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

const CalendarPageSidebar = () => {
  return (
    <Sidebar className="flex flex-col h-full" side="left" variant="inset">
      <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
        <div className="flex flex-col gap-4"></div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default CalendarPageSidebar;
