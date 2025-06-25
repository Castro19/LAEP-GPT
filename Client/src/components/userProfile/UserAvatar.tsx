import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * UserAvatar Component
 *
 * Displays a clickable user avatar that navigates to the profile edit page.
 * Shows the user's initials as a fallback when no profile image is available.
 * Handles authentication state and displays error messages for unauthenticated users.
 *
 * @component
 * @example
 * ```tsx
 * <UserAvatar />
 * ```
 *
 * @dependencies
 * - react: For React hooks and event handling
 * - react-router-dom: For navigation functionality
 * - @/redux: For Redux state management
 * - @/components/ui/avatar: For avatar UI components
 *
 * @features
 * - Clickable avatar with hover effects
 * - Automatic navigation to profile edit page
 * - Authentication state checking
 * - Error message display for unauthenticated users
 * - Loading state handling
 * - User initials fallback
 * - Responsive design
 *
 * @state
 * - Uses Redux for auth and user state management
 * - Local state for error messages
 * - React Router for navigation
 *
 * @accessibility
 * - Cursor pointer for clickable elements
 * - Error messages for unauthenticated users
 * - Loading state indication
 * - Semantic HTML structure
 *
 * @styling
 * - Tailwind CSS classes for responsive design
 * - Hover scale effect (hover:scale-110)
 * - Smooth transitions (transition-transform)
 * - Rounded avatar design
 * - Border styling for fallback state
 * - Fixed positioning for error messages
 *
 * @error-handling
 * - Displays error message for unauthenticated users
 * - Prevents navigation when not logged in
 * - Graceful fallback to initials
 *
 * @animations
 * - Hover scale animation
 * - Fade in/out for error messages
 * - Smooth transitions
 */
export function UserAvatar() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { userLoggedIn, loading } = useAppSelector((state) => state.auth);
  const userData = useAppSelector((state) => state.user.userData);

  /**
   * Handles the avatar click event
   * Checks authentication status and navigates to profile edit page
   * @param {React.MouseEvent} e - The click event
   */
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
