import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { HiOutlineAcademicCap } from "react-icons/hi2";
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
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useAppSelector } from "@/redux";

function OuterSidebar() {
  const { userData } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNaviation = (path: string) => {
    if (path === "/flowchart" && userData.flowchartInformation.flowchartId) {
      navigate(`/flowchart/${userData.flowchartInformation.flowchartId}`);
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => {
    if (path === "/flowchart" && userData.flowchartInformation.flowchartId) {
      return (
        location.pathname ===
        `/flowchart/${userData.flowchartInformation.flowchartId}`
      );
    } else {
      return location.pathname === path;
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
                  <Button
                    variant="ghost"
                    onClick={() => handleNaviation("/")}
                    className={`${
                      isActive("/")
                        ? "text-slate-500 hover:text-slate-600"
                        : "hover:text-slate-600"
                    }`}
                  >
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
                        className={`${
                          isActive("/chat")
                            ? "text-slate-500 hover:text-slate-600"
                            : "hover:text-slate-600"
                        }`}
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
                        className={`${
                          isActive("/section")
                            ? "text-slate-500 hover:text-slate-600"
                            : "hover:text-slate-600"
                        }`}
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
                        onClick={() => handleNaviation("/calendar")}
                        className={`${
                          isActive("/calendar")
                            ? "text-slate-500 hover:text-slate-600"
                            : "hover:text-slate-600"
                        }`}
                      >
                        <FaCalendarAlt className="m-auto w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Weekly Calendar</TooltipContent>
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
                        className={`${
                          isActive("/flowchart")
                            ? "text-slate-500 hover:text-slate-600"
                            : "hover:text-slate-600"
                        }`}
                      >
                        <HiOutlineAcademicCap className="m-auto w-5 h-5" />
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
                      className={`${
                        isActive("/profile/edit")
                          ? "text-slate-500 hover:text-slate-600"
                          : "hover:text-slate-600"
                      }`}
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
