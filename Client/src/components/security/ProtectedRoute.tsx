import { ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/redux"; // Adjust the import path as necessary

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { userId: urlUserId, chatId: urlChatId } = useParams<{
    userId: string;
    chatId: string;
  }>();

  // Redux
  const { userLoggedIn, userId } = useAppSelector((state) => state.auth);
  const currentChatId = useAppSelector((state) => state.message.currentChatId);

  useEffect(() => {
    if (!userLoggedIn) {
      // If the user is not logged in, redirect to the login page
      navigate("/login", { replace: true });
    } else if (urlUserId !== userId) {
      // If the URL userId does not match the logged-in userId
      navigate(`/${userId}`, { replace: true });
    } else if (urlChatId && urlChatId !== currentChatId) {
      // If the URL chatId does not match the current chatId
      navigate(`/${userId}/chat/${currentChatId}`, { replace: true });
    }
  }, [navigate, userLoggedIn, userId, urlUserId, currentChatId, urlChatId]);

  return <>{children}</>;
};

export default ProtectedRoute;
