import { AppDispatch } from "@/redux/store";
import { scheduleBuilderLogActions } from "@/redux";

export const onNewScheduleBuilderChat = (
  currentScheduleChatId: string | null,
  dispatch: AppDispatch,
  error: string | null,
  isLoading: boolean
) => {
  if (currentScheduleChatId) {
    if (isLoading) {
      // Cancel any ongoing requests
      dispatch(scheduleBuilderLogActions.clearCurrentLog());
    }
    dispatch(scheduleBuilderLogActions.setScheduleChatId(""));
  }

  if (error) {
    dispatch(scheduleBuilderLogActions.clearError());
  }

  // Create a new chat
  dispatch(scheduleBuilderLogActions.newScheduleChat());
};
