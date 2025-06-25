import { NavLink } from "react-router-dom";
// Icon

// Component
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
// Redux
import { useAppSelector } from "@/redux";

/**
 * UserMenu Component
 *
 * Displays user information and authentication controls.
 * Shows user avatar and name when logged in, or login/signup buttons when not authenticated.
 * Provides a responsive layout that adapts to authentication state.
 *
 * @component
 * @example
 * ```tsx
 * <UserMenu />
 * ```
 *
 * @dependencies
 * - react-router-dom: For navigation links
 * - ./UserAvatar: For user avatar display
 * - ../ui/button: For button components
 * - @/redux: For Redux state management
 *
 * @features
 * - Conditional rendering based on authentication state
 * - User avatar and name display for authenticated users
 * - Login and signup buttons for unauthenticated users
 * - Responsive design with proper spacing
 * - Fixed bottom positioning for auth buttons
 * - Dark mode support
 *
 * @state
 * - Uses Redux for authentication and user state
 * - Conditional rendering based on userLoggedIn status
 *
 * @accessibility
 * - Semantic HTML structure
 * - Clear navigation links
 * - Proper contrast ratios
 * - Responsive text wrapping
 *
 * @styling
 * - Tailwind CSS classes for responsive design
 * - Dark mode support with dark: variants
 * - Fixed positioning for auth buttons
 * - Proper spacing and alignment
 * - Shadow effects for visual hierarchy
 * - Responsive text handling
 *
 * @layout
 * - Flexbox layout for proper alignment
 * - Fixed bottom positioning for auth controls
 * - Responsive max-width container
 * - Proper gap spacing between elements
 *
 * @responsive
 * - Adapts to different screen sizes
 * - Text wrapping for long names
 * - Proper overflow handling
 * - Mobile-friendly button layout
 */
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
              <NavLink to="/register/register/login">Login</NavLink>
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
