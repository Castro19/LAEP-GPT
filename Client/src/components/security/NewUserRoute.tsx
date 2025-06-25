import { useAppSelector } from "@/redux";
import { Navigate } from "react-router-dom";
import SignInFlow from "../register/SignInFlow";

/**
 * NewUserRoute - Route component for new user onboarding flow
 *
 * This component handles the routing logic for new users, ensuring they complete
 * the onboarding process before accessing the main application. It provides
 * appropriate redirects based on user authentication and onboarding status.
 *
 * @component
 *
 * @example
 * ```tsx
 * // In router configuration
 * <Route path="/sign-in-flow" element={<NewUserRoute />} />
 * ```
 *
 * @dependencies
 * - Redux store for authentication and user state
 * - React Router for navigation
 * - SignInFlow component for onboarding interface
 *
 * @features
 * - New user onboarding flow management
 * - Authentication state checking
 * - Admin user special handling
 * - Loading state handling
 * - Automatic redirects based on user state
 * - SignInFlow component rendering
 *
 * @userFlow
 * - Checks if user is logged in
 * - Determines if user is new or existing
 * - Handles admin users differently
 * - Redirects to appropriate destinations
 * - Renders onboarding flow for new users
 *
 * @redirects
 * - Unauthenticated users → "/register/login"
 * - Existing non-admin users → "/chat"
 * - New users → SignInFlow component
 * - Admin users → SignInFlow component (special handling)
 *
 * @state
 * - userLoggedIn: Whether user is authenticated
 * - loading: Authentication loading state
 * - isNewUser: Whether user is new and needs onboarding
 * - userData: User information including userType
 *
 * @adminHandling
 * - Admin users are treated differently from regular users
 * - Admins can access the onboarding flow even if not new users
 * - Special routing logic for admin user types
 *
 * @styling
 * - Simple loading indicator
 * - Relies on SignInFlow component for styling
 * - Consistent with application theme
 *
 * @security
 * - Ensures proper user authentication
 * - Enforces onboarding completion for new users
 * - Maintains user type-based access control
 * - Prevents unauthorized access to onboarding flow
 */
const NewUserRoute = () => {
  const { userLoggedIn, loading, isNewUser } = useAppSelector(
    (state) => state.auth
  );
  const { userData } = useAppSelector((state) => state.user);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator instead of returning null
  }

  if (!userLoggedIn) {
    return <Navigate to="/register/login" replace />;
  }

  if (!isNewUser) {
    if (userData.userType !== "admin") return <Navigate to="/chat" replace />;
  }

  return (
    <>
      <SignInFlow />
    </>
  ); // Render child routes
};

export default NewUserRoute;
