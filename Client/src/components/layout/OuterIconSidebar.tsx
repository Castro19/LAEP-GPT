import { useState } from "react";
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
import { IoHomeSharp, IoLogOutOutline } from "react-icons/io5";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { UserAvatar } from "../userProfile/UserAvatar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { signOutUser } from "@/redux/auth/authSlice";

function OuterSidebar() {
  const { userData } = useAppSelector((state) => state.user);
  const { currentChatId } = useAppSelector((state) => state.message);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileHovered, setIsProfileHovered] = useState(false);

  const handleNavigation = (path: string) => {
    if (path === "/flowchart" && userData.flowchartInformation.flowchartId) {
      navigate(`/flowchart/${userData.flowchartInformation.flowchartId}`);
    } else if (path === "/chat" && currentChatId) {
      navigate(`/chat/${currentChatId}`);
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
                    onClick={() => handleNavigation("/")}
                    className={`${
                      isActive("/")
                        ? "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-600"
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
                        onClick={() => handleNavigation("/chat")}
                        className={`${
                          isActive("/chat")
                            ? "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-600"
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
                        onClick={() => handleNavigation("/section")}
                        className={`${
                          isActive("/section")
                            ? "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-600"
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
                        onClick={() => handleNavigation("/calendar")}
                        className={`${
                          isActive("/calendar")
                            ? "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-600"
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
                        onClick={() => handleNavigation("/flowchart")}
                        className={`${
                          isActive("/flowchart")
                            ? "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-600"
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

            <SidebarMenu
              className="mb-6 pt-4 justify-center items-center border-t-2 border-sidebar-border dark:border-slate-800"
              onMouseEnter={() => setIsProfileHovered(true)}
              onMouseLeave={() => setIsProfileHovered(false)}
            >
              {isProfileHovered && (
                <div className="mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => dispatch(signOutUser())}
                        >
                          <IoLogOutOutline className="m-auto w-5 h-5 rotate-180 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sign Out</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => handleNavigation("/profile/edit")}
                      className={`${
                        isActive("/profile/edit")
                          ? "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-600"
                          : "hover:text-slate-600"
                      }`}
                    >
                      <UserAvatar />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">View Profile</TooltipContent>
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
