import { ReactNode } from "react";
import { useAppSelector } from "@/redux";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userLoggedIn, loading, isNewUser } = useAppSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (loading) {
    return null; // or a loading indicator
  }

  if (!userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (isNewUser && !location.pathname.startsWith("/sign-in-flow")) {
    return <Navigate to="/sign-in-flow/about-me" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
