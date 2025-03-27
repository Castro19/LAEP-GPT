// Redux:
import {
  useAppDispatch,
  assistantActions,
  layoutActions,
  useAppSelector,
} from "@/redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
// My components
import { ModeDropDown, NewChat, onNewChat } from "@/components/chat";
// Types
import { AssistantType, MessageByChatIdType } from "@polylink/shared/types";
// UI Components & Icons
import { FiSidebar } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { AppDispatch } from "@/redux/store";

export const handleModeSelection = (
  model: AssistantType,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  currentChatId: string | null,
  error: any,
  loading: { [chatId: string]: boolean },
  messagesByChatId: MessageByChatIdType
) => {
  if (model && model.id) {
    const modelId = model.id;
    dispatch(assistantActions.setCurrentAssistant(modelId));
    dispatch(layoutActions.toggleDropdown(false));
    onNewChat(currentChatId, dispatch, navigate, error, loading, messagesByChatId);
  }
};

const ChatHeader = () => {
  // Redux:
  const dispatch = useAppDispatch();
  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );

  const error = useAppSelector((state) => state.message.error);
  const navigate = useNavigate();

  const { toggleSidebar } = useSidebar();

  const handleModelSelect = (model: AssistantType) => {
    handleModeSelection(
      model,
      dispatch,
      navigate,
      currentChatId,
      error,
      loading,
      messagesByChatId
    );
  };

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-40 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={toggleSidebar}>
          <FiSidebar className="m-auto w-5 h-5" />
        </Button>
        <ModeDropDown onSelect={handleModelSelect} />
        <NewChat />
      </div>
    </header>
  );
};

export default ChatHeader;
