import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { FaCalendarAlt, FaSearch } from "react-icons/fa";
// (Use your icons or lucide-react icons, e.g. Home, User, etc.)

import { IoMdChatboxes } from "react-icons/io";
import { IoHomeSharp } from "react-icons/io5";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { UserAvatar } from "../userProfile/UserAvatar";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAppSelector } from "@/redux";
function OuterSidebar() {
  const { userData } = useAppSelector((state) => state.user);

  const navigate = useNavigate();

  const handleNaviation = (path: string) => {
    if (path === "/flowchart" && userData.flowchartInformation.flowchartId) {
      navigate(`/flowchart/${userData.flowchartInformation.flowchartId}`);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen w-16 z-50 ">
      <SidebarProvider className="h-full">
        <Sidebar
          collapsible="none"
          variant="sidebar"
          side="left"
          className="border-r-2 dark:border-slate-700"
        >
          <SidebarHeader className="mt-4 flex-none">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => handleNaviation("/")}>
                    <IoHomeSharp className="m-auto w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Home Page</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarHeader>
          <SidebarContent className="flex flex-col mt-4">
            <div className="flex-grow flex flex-col gap-8">
              <SidebarMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => handleNaviation("/chat")}
                      >
                        <IoMdChatboxes className="m-auto w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>AI Chat</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenu>
              <SidebarMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => handleNaviation("/section")}
                      >
                        <FaSearch className="m-auto w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Course Search</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenu>
              <SidebarMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => handleNaviation("/flowchart")}
                      >
                        <FaCalendarAlt className="m-auto w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Flowchart</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenu>
            </div>
            <SidebarMenu className="mb-6 pt-4 justify-center items-center border-t-2 border-sidebar-border dark:border-slate-800">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => handleNaviation("/profile/edit")}
                    >
                      <UserAvatar />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export default OuterSidebar;
