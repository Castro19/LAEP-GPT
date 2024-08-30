import { ReactNode, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: urlUserId } = useParams<{ userId: string }>();

  const { userLoggedIn, currentUser, loading, emailVerified, userId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("ProtectedRoute: Current path", location.pathname);
    console.log("ProtectedRoute: userLoggedIn", userLoggedIn);
    console.log("ProtectedRoute: currentUser", currentUser);
    console.log("ProtectedRoute: userId", userId);
    console.log("ProtectedRoute: urlUserId", urlUserId);
    //console.log("ProtectedRoute: userType", currentUser?.userType);

    if (loading) {
      console.log("ProtectedRoute: Auth state is loading");
      return;
    }

    if (!userLoggedIn || !currentUser) {
      console.log("ProtectedRoute: User not logged in, redirecting to login");
      navigate("/login", { replace: true });
    //} else if (!emailVerified) {
       //Check that the email is verified, and redirect to verification page if not
      //console.log("ProtectedRoute: Email not verified, redirecting to verify email page");
      //if (!location.pathname.endsWith("/email-verification-needed")) {
      //  navigate("/email-verification-needed", { replace: true });
     // }
    } else if (location.pathname.startsWith("/profile/")) {
      console.log("ProtectedRoute: On profile page");
      if (urlUserId !== currentUser.uid) {
        console.log("ProtectedRoute: Unauthorized profile access, redirecting to own profile");
        navigate(`/profile/${currentUser.uid}`, { replace: true });
      }
    } else if (urlUserId && urlUserId !== userId) {
      console.log("ProtectedRoute: URL userId does not match logged-in userId, redirecting");
      navigate(`/${currentUser.uid}`, { replace: true });
    }
  }, [navigate, userLoggedIn, currentUser, urlUserId, location.pathname, loading, emailVerified, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;