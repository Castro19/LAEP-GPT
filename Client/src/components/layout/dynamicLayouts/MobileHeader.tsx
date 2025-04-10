import { UserAvatar } from "@/components/userProfile/UserAvatar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useAppSelector,
  assistantActions,
  classSearchActions,
  useAppDispatch,
} from "@/redux";
import { onNewChat } from "../../chat/helpers/newChatHandler";

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
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const { currentChatId } = useAppSelector((state) => state.message);
  const { currentCalendar } = useAppSelector((state) => state.calendar);
  const { error, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );
  const { assistantList } = useAppSelector((state) => state.assistant);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChatClick = () => {
    dispatch(classSearchActions.setIsInitialState(true));

    if (assistantList.length > 0) {
      dispatch(assistantActions.setCurrentAssistant(assistantList[0].id));
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

  const handleNavigation = (path: string) => {
    dispatch(classSearchActions.setIsInitialState(true));

    if (path === "/flowchart" && userData.flowchartInformation.flowchartId) {
      navigate(`/flowchart/${userData.flowchartInformation.flowchartId}`);
    } else if (path === "/chat") {
      handleChatClick();
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
    <div className="relative z-50 w-full">
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
                onClick={() => handleNavigation("/class-search")}
                className={`${
                  isActive("/class-search")
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => navigate("/profile/edit")}>
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
