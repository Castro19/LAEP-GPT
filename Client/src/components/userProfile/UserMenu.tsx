import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-item";
import { useAuth } from "@/contexts/authContext";
import { doSignOut } from "@/firebase/auth";
import { Button } from "@/components/ui/button";

const UserMenu = () => {
  const { userLoggedIn } = useAuth();

  const [active, setActive] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignOut = () => {
    doSignOut().then(() => {
      navigate("/");
    });
  };

  return (
    <div className="">
      {userLoggedIn ? (
        <div className="flex justify-center items-center fixed bottom-5">
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="profile">
              <HoveredLink
                to="/"
                onClick={handleSignOut}
                className="hover:text-gray-300"
              >
                Sign out
              </HoveredLink>
            </MenuItem>
          </Menu>
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
