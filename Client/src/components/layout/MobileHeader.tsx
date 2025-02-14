import { useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { IoHomeSharp, IoLogOutOutline } from "react-icons/io5";
import { IoMdChatboxes } from "react-icons/io";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { UserAvatar } from "../userProfile/UserAvatar";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux";
import { signOutUser } from "@/redux/auth/authSlice";

function MobileHeader() {
  const { userData } = useAppSelector((state) => state.user);
  const { currentChatId } = useAppSelector((state) => state.message);
  const { currentCalendar } = useAppSelector((state) => state.calendar);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Controls whether the slide-down menu is visible
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  const handleNavigation = (path: string) => {
    setMenuOpen(false); // close menu when a navigation option is selected
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
    <div className="relative z-50">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 border-b-2 dark:border-slate-700 flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </Button>
          {/* Optional: A title or logo can be placed here */}
          <span className="ml-2 font-bold">Menu</span>
        </div>

        {/* Profile Section */}
        <div
          className="flex items-center"
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
        >
          {isProfileHovered && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => dispatch(signOutUser())}
                    className="mr-2"
                  >
                    <IoLogOutOutline className="w-5 h-5 rotate-180 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sign Out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/profile/edit")}
                >
                  <UserAvatar />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">View Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-14 left-0 w-full bg-white dark:bg-gray-900 border-b-2 dark:border-slate-700 transform transition-transform duration-300 ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-around py-2">
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
                  <IoHomeSharp className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Home Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
                  <IoMdChatboxes className="w-5 h-5" />
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
                  <FaSearch className="w-5 h-5" />
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
                  <FaCalendarAlt className="w-5 h-5" />
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
                  <HiOutlineAcademicCap className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Flowchart</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export default MobileHeader;
