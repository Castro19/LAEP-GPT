// Redux:
import {
  useAppDispatch,
  assistantActions,
  layoutActions,
  useAppSelector,
} from "@/redux";
import { useNavigate } from "react-router-dom";
// My components
import { ModeDropDown, NewChat, onNewChat } from "@/components/chat";
// Types
import { AssistantType } from "@polylink/shared/types";
// UI Components & Icons
import { FiSidebar } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const ChatHeader = () => {
  // Redux:
  const dispatch = useAppDispatch();
  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );

  const error = useAppSelector((state) => state.message.error);
  const navigate = useNavigate();

  const { toggleSidebar } = useSidebar();

  const handleModeSelection = (model: AssistantType) => {
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

  return (
    <header className="sticky top-0 bg-background text-white p-4 z-40 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={toggleSidebar}>
          <FiSidebar className="m-auto w-5 h-5" />
        </Button>
        <ModeDropDown onSelect={handleModeSelection} />
        <NewChat />
      </div>
    </header>
  );
};

export default ChatHeader;
