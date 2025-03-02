import { UserAvatar } from "@/components/userProfile/UserAvatar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
// Icons
import { IoMdChatboxes } from "react-icons/io";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi2";

function MobileHeader() {
  const { userData } = useAppSelector((state) => state.user);
  const { currentChatId } = useAppSelector((state) => state.message);
  const { currentCalendar } = useAppSelector((state) => state.calendar);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (path === "/flowchart" && userData.flowchartInformation.flowchartId) {
      navigate(`/flowchart/${userData.flowchartInformation.flowchartId}`);
    } else if (path === "/chat" && currentChatId) {
      navigate(`/chat/${currentChatId}`);
    } else if (path === "/calendar" && currentCalendar) {
      navigate(`/calendar/${currentCalendar.id}`);
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
    } else if (path === "/calendar" && currentCalendar) {
      return location.pathname === `/calendar/${currentCalendar.id}`;
    } else {
      return location.pathname === path;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-900">
      <div className="flex justify-around py-2">
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
                <IoMdChatboxes className="w-5 h-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>AI Chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
                <FaSearch className="w-5 h-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Course Search</TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
                <FaCalendarAlt className="w-5 h-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Weekly Calendar</TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
                <HiOutlineAcademicCap className="w-5 h-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Flowchart</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => navigate("/profile/edit")}
                className="text-white"
              >
                <UserAvatar />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">View Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default MobileHeader;
