import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAppDispatch } from "@/redux";
import { useNavigate } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { signOutUser } from "@/redux/auth/authSlice";

const ChatSidebarFooter = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleSignOut = () => {
    dispatch(signOutUser()); // Trigger the thunk to sign out the user
  };

  return (
    <SidebarFooter className="border-t dark:border-slate-700">
      <SidebarMenu>
        <SidebarMenuButton onClick={() => navigate("/profile/edit")}>
          <IoPerson />
        </SidebarMenuButton>
        <SidebarMenuButton onClick={handleSignOut} className="text-red-500">
          <CiLogout />
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default ChatSidebarFooter;
