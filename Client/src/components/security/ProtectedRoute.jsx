import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { userLoggedIn, userId } = useAuth();
  const chatId = useSelector((state) => state.message.chatId);
  const navigate = useNavigate();
  const { userId: urlUserId, chatId: urlChatId } = useParams(); // This captures the userId from the URL

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/login", { replace: true });
    } else if (userLoggedIn && (userId !== urlUserId || chatId != urlChatId)) {
      navigate(`/${userId}`); // Redirects to the correct user page
    }
  }, [navigate, userLoggedIn, userId, urlUserId]);

  return children;
};

export default ProtectedRoute;
