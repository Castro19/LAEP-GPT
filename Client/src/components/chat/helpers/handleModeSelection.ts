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
