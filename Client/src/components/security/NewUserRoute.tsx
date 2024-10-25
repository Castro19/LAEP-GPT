import { ReactNode } from "react";
import { useAppSelector } from "@/redux";
import { Navigate } from "react-router-dom";

type NewUserRouteProps = {
  children: ReactNode;
};

const NewUserRoute = ({ children }: NewUserRouteProps) => {
  const { userLoggedIn, loading, isNewUser } = useAppSelector(
    (state) => state.auth
  );

  if (loading) {
    return null; // or a loading indicator
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isNewUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default NewUserRoute;
