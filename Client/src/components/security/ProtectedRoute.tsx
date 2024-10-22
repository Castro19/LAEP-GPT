import { ReactNode, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { authActions, useAppDispatch, useAppSelector } from "@/redux";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: urlUserId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const { userLoggedIn, currentUser, loading, userId, isNewUser } =
    useAppSelector((state) => state.auth);

  console.log("CURRENT USER: ", currentUser);

  useEffect(() => {
    if (loading) {
      console.log("ProtectedRoute: Auth state is loading");
      return;
    }

    if (!userLoggedIn || !currentUser) {
      console.log("ProtectedRoute: User not logged in, redirecting to login");
      navigate("/login", { replace: true });
      return;
    }

    if (isNewUser) {
      // Swap for non-testing purposes
      console.log("ProtectedRoute: User is new, redirecting to onboarding");
      navigate(`/sign-in-flow/about-me`, { replace: true });
      dispatch(authActions.setIsNewUser(undefined)); // Reset the flag
      return;
    }

    if (location.pathname.startsWith("/profile/")) {
      console.log("ProtectedRoute: On profile page");
      if (urlUserId !== userId) {
        console.log(
          "ProtectedRoute: Unauthorized profile access, redirecting to own profile"
        );
        navigate(`/profile/edit/${userId}`, { replace: true });
        return;
      }
    } else if (urlUserId && urlUserId !== userId) {
      console.log(
        "ProtectedRoute: URL userId does not match logged-in userId, redirecting"
      );
      navigate(`/${userId}`, { replace: true });
      return;
    }
  }, [
    loading,
    userLoggedIn,
    currentUser,
    isNewUser,
    userId,
    urlUserId,
    location.pathname,
    navigate,
    dispatch,
  ]);

  return <>{children}</>;
};

export default ProtectedRoute;
