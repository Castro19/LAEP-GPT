import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Icon
import { FaSignOutAlt } from "react-icons/fa";
// Component
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
// Redux
import { useAppDispatch, useAppSelector } from "@/redux";
import { signOutUser } from "@/redux/auth/authSlice";

const UserMenu = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const { userLoggedIn } = useAppSelector((state) => state.auth);
  const { userData } = useAppSelector((state) => state.user);
  const handleSignOut = () => {
    dispatch(signOutUser({ navigate })); // Trigger the thunk to sign out the user
  };

  return (
    <div className="relative">
      {userLoggedIn ? (
        <div className="flex justify-start items-center space-x-4">
          <UserAvatar />
          <h4 className="ml-4 text-gray-800 dark:text-gray-300 font-medium text-wrap overflow-y-auto overflow-x-hidden">
            {userData?.name}
          </h4>
          <button
            className="text-lg hover:text-red-500"
            onClick={handleSignOut}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FaSignOutAlt />
            {isHovered && (
              <span className="absolute right-0  translate-y-1 bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap">
                Sign Out
              </span>
            )}
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center fixed inset-x-0 bottom-1 shadow-2xl bg-gray-50 dark:bg-gray-800 py-3">
          <div className="max-w-screen-md mx-auto flex gap-4">
            <Button className="dark:bg-slate-300  text-white font-bold py-2 px-4 rounded">
              <NavLink to="/register/login">Login</NavLink>
            </Button>
            <Button className="dark:bg-slate-300 font-bold py-2 px-4 rounded">
              <NavLink to="/register/signup">Sign Up</NavLink>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
