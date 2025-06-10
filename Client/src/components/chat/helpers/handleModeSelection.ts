/**
 * @file handleModeSelection.ts
 * @description Handler for assistant selection in dropdown/sidebar. Manages the process
 * of switching between different AI assistants.
 *
 * @function handleModeSelection
 * @description Handles the selection of a new assistant and initiates a new chat.
 *
 * @param {Object} params
 * @param {AssistantType} params.assistant - The selected assistant
 * @param {Function} params.setShowDropdown - Function to control dropdown visibility
 * @param {Function} params.dispatch - Redux dispatch function
 * @param {Function} params.navigate - React Router navigation function
 *
 * @behavior
 * 1. Sets the new assistant in Redux
 * 2. Hides the assistant dropdown
 * 3. Creates a new chat session
 */

import { AssistantType } from "@polylink/shared/types";

import { AppDispatch } from "@/redux/store";
import { MessageByChatIdType } from "@polylink/shared/types";
import { NavigateFunction } from "react-router-dom";
import { assistantActions, layoutActions } from "@/redux";
import { onNewChat } from "./newChatHandler";

export const handleModeSelection = (
  model: AssistantType,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  currentChatId: string | null,
  error: string | null,
  loading: { [chatId: string]: boolean },
  messagesByChatId: MessageByChatIdType
) => {
  if (model && model.id) {
    const modelId = model.id;
    dispatch(assistantActions.setCurrentAssistant(modelId));
    dispatch(layoutActions.toggleDropdown(false));
    onNewChat(
      currentChatId,
      dispatch,
      navigate,
      error,
      loading,
      messagesByChatId
    );
  }
};
