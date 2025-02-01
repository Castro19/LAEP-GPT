import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserMenu from "@/components/userProfile/UserMenu";
import { ChevronUp } from "lucide-react";
import { signOutUser } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate } from "react-router-dom";

const ChatSidebarFooter = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector((state) => state.auth);
  const userData = useAppSelector((state) => state.user.userData);
  const handleSignOut = () => {
    dispatch(signOutUser()); // Trigger the thunk to sign out the user
  };

  const handleNavigateToFlowcharts = () => {
    if (userId && userData.flowchartInformation.flowchartId) {
      navigate(`/flowchart/${userData.flowchartInformation.flowchartId}`);
    } else {
      navigate("/flowchart");
    }
  };

  const handleNavigateToSections = () => {
    navigate("/section");
  };

  return (
    <SidebarFooter className="h-20 border-t dark:border-slate-700">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-full">
                <UserMenu />
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem onClick={() => navigate("/profile/edit")}>
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigateToSections}>
                <span>Search Sections</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigateToFlowcharts}>
                <span>Manage Flowcharts</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <span className="text-white rounded-md whitespace-nowrap">
                  Sign Out
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default ChatSidebarFooter;
