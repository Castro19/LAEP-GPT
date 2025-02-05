import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { FaCalendarAlt } from "react-icons/fa";
// (Use your icons or lucide-react icons, e.g. Home, User, etc.)

import { IoMdChatboxes } from "react-icons/io";
import { IoHomeSharp } from "react-icons/io5";
import ChatSidebarFooter from "../chatLog/ChatSidebarFooter";

function OuterSidebar() {
  return (
    <div className="min-h-screen w-16 dark:border-r-slate-400 border-r-2">
      <SidebarProvider className="h-full">
        <Sidebar collapsible="none" variant="sidebar" side="left">
          <SidebarHeader className="mt-6 border-b-2 border-sidebar-border dark:border-slate-700 flex-none">
            <SidebarMenuButton tooltip="Profile" asChild>
              <a href="/">
                <IoHomeSharp className="m-auto w-16 h-16" />
              </a>
            </SidebarMenuButton>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuButton className="my-2" tooltip="Flowchart" asChild>
                <a href="/flowchart">
                  <FaCalendarAlt className="m-auto" size={18} />
                </a>
              </SidebarMenuButton>

              <SidebarMenuItem>
                <SidebarMenuButton className="my-2" tooltip="Chat" asChild>
                  <a href="/chat">
                    <IoMdChatboxes className="m-auto" size={20} />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <ChatSidebarFooter />
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export default OuterSidebar;
