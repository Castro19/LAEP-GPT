import { messageActions } from "@/redux";
import { AppDispatch } from "@/redux/store";
import { NavigateFunction } from "react-router-dom";

export const onNewChat = (
  currentChatId: string | null,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  error: string | null
) => {
  if (currentChatId) {
    console.log("currentChatId", currentChatId);
    dispatch(messageActions.setCurrentChatId(null));

    if (error) {
      dispatch(messageActions.clearError()); // Clear error when user starts typing
    }
    dispatch(messageActions.setCurrentChatId(null));
  }

  dispatch(messageActions.toggleNewChat(true)); // Flag indicating it's a new chat
  navigate(`/chat`);
};
