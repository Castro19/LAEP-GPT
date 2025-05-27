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
import { IoArrowBack, IoLogOutOutline } from "react-icons/io5";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { UserAvatar } from "../../userProfile/UserAvatar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  assistantActions,
  classSearchActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { signOutUser } from "@/redux/auth/authSlice";
import { onNewChat } from "../../chat/helpers/newChatHandler";

function OuterIconSidebar() {
  const { userData } = useAppSelector((state) => state.user);
  const { currentChatId } = useAppSelector((state) => state.message);
  const { currentSchedule } = useAppSelector((state) => state.schedule);
  const { error, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );
  const { assistantList } = useAppSelector((state) => state.assistant);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileHovered, setIsProfileHovered] = useState(false);

  const handleChatClick = () => {
    dispatch(classSearchActions.setIsInitialState(true));

    if (assistantList.length > 0) {
      dispatch(assistantActions.setAssistantByTitle("Calpoly SLO"));
    }

    onNewChat(
      currentChatId,
      dispatch,
      navigate,
      error,
      loading,
      messagesByChatId
    );
    if (currentChatId) {
      navigate(`/chat/${currentChatId}`);
    } else {
      navigate("/chat");
    }
  };

  const goBack = () => {
    // Check if history length is sufficient for navigating back
    if (window.history.length > 2) {
      navigate(-1);
    }
    // Check if they landed on this page directly (no referrer)
    else if (!document.referrer || document.referrer === "") {
      navigate("/");
    }
    // Edge case: Ensure they are not navigating outside your domain
    else if (!document.referrer.startsWith(window.location.origin)) {
      navigate("/");
    }
    // Default case: Go back if safe
    else {
      navigate(-1);
    }
  };

  const handleNavigation = (path: string) => {
    dispatch(classSearchActions.setIsInitialState(true));

    if (path === "/flowchart" && userData.flowchartInformation.flowchartId) {
      navigate(`/flowchart/${userData.flowchartInformation.flowchartId}`);
    } else if (path === "/chat") {
      handleChatClick();
    } else if (
      path === "/schedule-builder" &&
      currentSchedule &&
      currentSchedule.id
    ) {
      navigate(`/schedule-builder/${currentSchedule.id}`);
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
    } else if (path === "/chat" && currentChatId) {
      return location.pathname === `/chat/${currentChatId}`;
    } else if (
      path === "/schedule-builder" &&
      currentSchedule &&
      currentSchedule.id
    ) {
      return location.pathname === `/schedule-builder/${currentSchedule.id}`;
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
                    onClick={() => goBack()}
                    className={`${
                      isActive("/")
                        ? "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-600"
                        : "hover:text-slate-600"
                    }`}
                  >
                    <IoArrowBack className="m-auto w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Go Back</TooltipContent>
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
                        onClick={() => handleNavigation("/class-search")}
                        className={`${
                          isActive("/class-search")
                            ? "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-600"
                            : "hover:text-slate-600"
                        }`}
                      >
                        <FaSearch className="m-auto w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Class Search</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenu>
              <SidebarMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigation("/schedule-builder")}
                        className={`${
                          isActive("/schedule-builder")
                            ? "text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-600"
                            : "hover:text-slate-600"
                        }`}
                      >
                        <FaCalendarAlt className="m-auto w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Schedule Builder</TooltipContent>
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

export default OuterIconSidebar;
