import { useAppSelector } from "@/redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

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
