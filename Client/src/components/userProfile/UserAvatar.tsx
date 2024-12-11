import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserAvatar() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { userLoggedIn, loading } = useAppSelector((state) => state.auth);
  const userData = useAppSelector((state) => state.user.userData);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!userLoggedIn) {
      setErrorMessage(
        "You need to be logged in to view profiles. Please log in and try again."
      );
      return;
    }
    navigate(`/profile/edit`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        <Avatar className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110">
          <AvatarFallback className="border-2 border-slate-700">
            {userData?.name?.charAt(0) || "N/A"}
          </AvatarFallback>
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
