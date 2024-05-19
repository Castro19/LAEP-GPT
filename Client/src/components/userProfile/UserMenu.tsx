import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { doSignOut } from "@/firebase/auth";
import { Button } from "@/components/ui/button";
import { FaSignOutAlt } from "react-icons/fa";

import UserAvatar from "./UserAvatar";

const UserMenu = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUserPhoto(user.photoURL);
        setUserName(user.displayName);
      } else {
        // User is signed out
        setUserPhoto(null);
        setUserName(null);
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("USER PHOTO: ", userPhoto);
    console.log("USER NAME: ", userName);
  }, [userName, userPhoto]);

  const { userLoggedIn } = useAuth();

  const navigate = useNavigate();

  const handleSignOut = () => {
    doSignOut().then(() => {
      navigate("/");
    });
  };

  return (
    <div className="relative">
      {userLoggedIn ? (
        <div className="flex justify-start items-center space-x-4">
          <UserAvatar userPhoto={userPhoto} />
          <h4 className="ml-4 text-gray-800 dark:text-gray-300 font-medium text-wrap overflow-y-auto overflow-x-hidden">
            {userName}
          </h4>
          <button
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
