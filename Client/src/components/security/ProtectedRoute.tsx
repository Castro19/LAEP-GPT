import { ReactNode, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useAppSelector } from "@/redux";

type ProtectedRouteProps = {
  children: ReactNode;
};
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userLoggedIn, userId } = useAuth();
  const chatId = useAppSelector((state) => state.message.currentChatId);
  const navigate = useNavigate();
  const { userId: urlUserId, chatId: urlChatId } = useParams(); // This captures the userId from the URL

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/login", { replace: true });
    } else if (
      userLoggedIn &&
      (urlUserId !== userId || (chatId && chatId !== urlChatId)) &&
      !(
        (urlUserId === userId && urlChatId === chatId) ||
        urlUserId === "gpts" ||
        urlUserId === "editor"
      )
    ) {
      navigate(`/${userId}`, { replace: true }); // Redirects to the correct user page
    }
  }, [navigate, userLoggedIn, userId, urlUserId, chatId, urlChatId]);

  return children;
};

export default ProtectedRoute;
