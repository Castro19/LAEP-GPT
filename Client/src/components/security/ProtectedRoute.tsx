import { useAppSelector } from "@/redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * ProtectedRoute - Route protection component for authenticated users
 *
 * This component provides route protection for authenticated users, ensuring
 * that only verified users with completed onboarding can access protected routes.
 * It handles various authentication states and redirects users appropriately.
 *
 * @component
 *
 * @example
 * ```tsx
 * // In router configuration
 * <Route path="/protected" element={<ProtectedRoute />}>
 *   <Route path="dashboard" element={<Dashboard />} />
 *   <Route path="profile" element={<Profile />} />
 * </Route>
 * ```
 *
 * @dependencies
 * - Redux store for authentication state
 * - React Router for navigation and routing
 * - useLocation hook for current route information
 *
 * @features
 * - Authentication state checking
 * - Email verification enforcement
 * - New user onboarding flow enforcement
 * - Loading state handling
 * - Automatic redirects based on user state
 * - Child route rendering with Outlet
 *
 * @authenticationFlow
 * - Checks if user is logged in
 * - Verifies email verification status
 * - Ensures new users complete onboarding
 * - Redirects to appropriate pages based on state
 *
 * @redirects
 * - Unauthenticated users → "/" (home page)
 * - Unverified email → "/verify-email"
 * - New users → "/sign-in-flow/terms"
 * - Authenticated users → Child routes via Outlet
 *
 * @state
 * - userLoggedIn: Whether user is authenticated
 * - loading: Authentication loading state
 * - isNewUser: Whether user is new and needs onboarding
 * - emailVerified: Whether user's email is verified
 *
 * @styling
 * - Simple loading indicator
 * - No additional styling (relies on child components)
 * - Consistent with application theme
 *
 * @security
 * - Prevents unauthorized access to protected routes
 * - Enforces email verification requirement
 * - Ensures proper user onboarding completion
 * - Maintains authentication state integrity
 */
const ProtectedRoute = () => {
  const { userLoggedIn, loading, isNewUser, emailVerified } = useAppSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator instead of returning null
  }

  if (!userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (isNewUser && !location.pathname.startsWith("/sign-in-flow")) {
    return <Navigate to="/sign-in-flow/terms" replace />;
  }

  return <Outlet />; // Render child routes
};

export default ProtectedRoute;
