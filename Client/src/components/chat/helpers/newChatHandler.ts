import { messageActions } from "@/redux";
import { AppDispatch } from "@/redux/store";
import { MessageObjType } from "@polylink/shared/types";
import { NavigateFunction } from "react-router-dom";

export const onNewChat = (
  currentMsgList: MessageObjType[],
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  error: string | null
) => {
  if (currentMsgList.length > 0) {
    dispatch(messageActions.resetMsgList()); // Reset the MsgList
    dispatch(messageActions.toggleNewChat(true)); // Flag indicating it's a new chat
    if (error) {
      dispatch(messageActions.clearError()); // Clear error when user starts typing
    }
  }
  navigate(`/chat`);
};
