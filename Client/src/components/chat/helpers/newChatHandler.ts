import { messageActions } from "@/redux";
import { AppDispatch } from "@/redux/store";
import { NavigateFunction } from "react-router-dom";
import { MessageByChatIdType } from "@polylink/shared/types";

export const onNewChat = (
  currentChatId: string | null,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  error: string | null,
  loading: { [chatId: string]: boolean },
  messagesByChatId: MessageByChatIdType,
  copilotMode: boolean = false
) => {
  if (currentChatId) {
    if (loading[currentChatId]) {
      // Get the last user message id. It will be the last or 2nd to last message in the array. it will always be the the last message of the array with the type "user"
      const lastMessages = messagesByChatId[currentChatId].content.slice(-2);
      const userMessageId = lastMessages.find(
        (message) => message.sender === "user"
      )?.id;
      if (userMessageId) {
        dispatch(
          messageActions.cancelBotResponse({
            userMessageId: userMessageId,
            chatId: currentChatId,
          })
        );
      }
    }
    dispatch(messageActions.setCurrentChatId(null));

    if (error) {
      dispatch(messageActions.clearError()); // Clear error when user starts typing
    }
    dispatch(messageActions.setCurrentChatId(null));
  }

  dispatch(messageActions.toggleNewChat(true)); // Flag indicating it's a new chat
  if (!copilotMode) {
    navigate(`/chat`);
  }
};
