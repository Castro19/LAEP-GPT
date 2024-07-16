import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { listenToAuthChanges } from "@/redux/auth/authSlice.ts";


export function UserAvatar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { userLoggedIn, currentUser, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  useEffect(() => {
    console.log("UserAvatar rendered with auth state:", { userLoggedIn, currentUser, loading });
  }, [userLoggedIn, currentUser, loading]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Avatar clicked, attempting to navigate to:", `/profile/${currentUser?.uid}`);
    console.log("Current auth state:", { userLoggedIn, currentUser });

    if (!userLoggedIn || !currentUser) {
      console.log("User not authenticated, showing error message");
      setErrorMessage("You need to be logged in to view profiles. Please log in and try again.");
      return;
    }

    console.log("Navigating to profile page");
    navigate(`/profile/${currentUser.uid}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        <Avatar className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110">
          <AvatarImage src={currentUser?.photoURL || "/imgs/test.png"} alt="User Avatar" />
        </Avatar>
      </div>
      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded shadow-lg text-sm animate-fadeInOut">
            {errorMessage}
          </div>
        </div>
      )}
    </>
  );
}

export default UserAvatar;