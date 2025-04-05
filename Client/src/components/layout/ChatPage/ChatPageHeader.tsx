// Redux:
import { useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate } from "react-router-dom";
// My components
import { ModeDropDown, NewChat } from "@/components/chat";
// Types
import { AssistantType } from "@polylink/shared/types";
// UI Components & Icons
import { FiSidebar } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { handleModeSelection } from "@/components/chat/helpers/handleModeSelection";

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
