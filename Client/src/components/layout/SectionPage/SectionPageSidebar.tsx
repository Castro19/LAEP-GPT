import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import ChatSidebarFooter from "@/components/chatLog/ChatSidebarFooter";
import { useNavigate } from "react-router-dom";
const SectionPageSidebar = () => {
  const navigate = useNavigate();

  return (
    <Sidebar className="flex flex-col h-full">
      <SidebarHeader className="mt-4 border-b border-sidebar-border dark:border-slate-700 flex-none">
        <Button
          className="text-2xl font-bold leading-tight"
          variant="link"
          onClick={() => navigate("/")}
        >
          PolyLink
        </Button>
      </SidebarHeader>
      <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
        <ScrollArea className="h-full"></ScrollArea>
      </SidebarContent>
      <ChatSidebarFooter />
    </Sidebar>
  );
};

export default SectionPageSidebar;
