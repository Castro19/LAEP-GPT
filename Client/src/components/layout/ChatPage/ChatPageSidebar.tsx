import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ChatPageSidebar() {
  const navigate = useNavigate();
  return (
    <Sidebar variant="sidebar" className="flex flex-col h-full">
      <SidebarHeader className="mt-4 border-b border-sidebar-border flex-none">
        <Button
          className="text-2xl"
          variant="link"
          onClick={() => navigate("/")}
        >
          PolyLink
        </Button>
      </SidebarHeader>
      <SidebarContent className="border-b border-sidebar-border flex-1 overflow-x-hidden m-4">
        <SidebarGroupLabel>Chatlogs</SidebarGroupLabel>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full">
                <div className="flex items-center justify-between w-full text-lg"></div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {/* Border */}

        {/* Border */}
        <div className="border-b border-sidebar-border"></div>
      </SidebarContent>
    </Sidebar>
  );
}
