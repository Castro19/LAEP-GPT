import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
// (Use your icons or lucide-react icons, e.g. Home, User, etc.)
import { Home, User } from "lucide-react";

export function OuterSidebar() {
  return (
    <div className="min-h-screen w-16 dark:border-r-slate-400 border-r-2">
      <SidebarProvider className="h-full">
        {/* 
        collapsible="none" ensures it doesn't collapse.
        variant="sidebar" uses the normal styling (so it’s just narrower).
      */}
        <Sidebar collapsible="none" variant="sidebar" side="left">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Home"
                  // Use an anchor or router link if needed
                  asChild
                >
                  <a href="/home">
                    <Home className="m-auto" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile" asChild>
                  <a href="/profile">
                    <User className="m-auto" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* add more icons as needed */}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export default OuterSidebar;
