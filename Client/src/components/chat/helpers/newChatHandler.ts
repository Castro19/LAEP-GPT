/**
 * @file newChatHandler.ts
 * @description Handler for creating new chat sessions. Manages the process of
 * resetting the current chat and starting a new one.
 *
 * @function handleNewChat
 * @description Handles the creation of a new chat session with proper cleanup.
 *
 * @param {Object} params
 * @param {Function} params.dispatch - Redux dispatch function
 * @param {Function} params.navigate - React Router navigation function
 * @param {string | null} params.currentChatId - ID of current chat
 * @param {string | null} params.currentUserMessageId - ID of current user message
 *
 * @behavior
 * 1. Cancels any pending chat if exists
 * 2. Resets current chat ID to null
 * 3. Clears any existing errors
 * 4. Toggles new chat state
 * 5. Navigates back to chat home
 */

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
  messagesByChatId: MessageByChatIdType
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

  navigate(`/chat`);
};
