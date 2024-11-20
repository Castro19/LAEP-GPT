import { NavLink } from "react-router-dom";
// Icon

// Component
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
// Redux
import { useAppSelector } from "@/redux";

const UserMenu = () => {
  const { userLoggedIn } = useAppSelector((state) => state.auth);
  const { userData } = useAppSelector((state) => state.user);

  return (
    <>
      {userLoggedIn ? (
        <div className="flex justify-start items-center space-x-4">
          <UserAvatar />
          <h4 className="ml-4 text-gray-800 dark:text-gray-300 font-medium text-wrap overflow-y-auto overflow-x-hidden">
            {userData?.name}
          </h4>
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
    </>
  );
};

export default UserMenu;
