import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userLoggedIn, loading, isNewUser } = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // Optionally, render a loading indicator or return null
      console.log("Loading indicator displayed");
      return;
    }
    // App is not loading and user is not authenticated
    else if (!userLoggedIn) {
      // User is not authenticated, redirect to login page
      navigate("/login", { replace: true });
    } else if (isNewUser) {
      // User is new, redirect to onboarding page
      navigate("/sign-in-flow/about-me", { replace: true });
    }
  }, [userLoggedIn, isNewUser, navigate, loading]); // Add dependencies

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
