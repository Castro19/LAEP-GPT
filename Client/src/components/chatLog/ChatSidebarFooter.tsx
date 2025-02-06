import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAppDispatch } from "@/redux";
import { CiLogout } from "react-icons/ci";
import { signOutUser } from "@/redux/auth/authSlice";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { FaCalendarAlt } from "react-icons/fa";

const ChatSidebarFooter = () => {
  const dispatch = useAppDispatch();
  const handleSignOut = () => {
    dispatch(signOutUser()); // Trigger the thunk to sign out the user
  };

  return (
    <SidebarFooter className="border-t dark:border-slate-700">
      <SidebarMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton tooltip="Flowchart" asChild>
                <a href="/flowchart">
                  <FaCalendarAlt className="m-auto" size={18} />
                </a>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent>Flowchart</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton onClick={handleSignOut} className="text-red-500">
              <CiLogout />
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent>Logout</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SidebarFooter>
  );
};

export default ChatSidebarFooter;
