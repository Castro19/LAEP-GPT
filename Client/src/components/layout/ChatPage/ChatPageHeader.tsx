import ModeDropDown from "../../chat/ModeDropDown";
import { useSidebar } from "@/components/ui/sidebar";
import NewChat from "../../chat/NewChat";
import { AssistantType } from "@polylink/shared/types";
import { BiChat } from "react-icons/bi";
// Redux:
import {
  useAppDispatch,
  assistantActions,
  layoutActions,
  useAppSelector,
} from "@/redux";
import { onNewChat } from "@/components/chat/helpers/newChatHandler";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  // Redux:
  const dispatch = useAppDispatch();
  const currentMsgList = useAppSelector((state) => state.message.msgList);
  const error = useAppSelector((state) => state.message.error);
  const navigate = useNavigate();

  const { toggleSidebar } = useSidebar();

  const handleModeSelection = (model: AssistantType) => {
    if (model && model.id) {
      const modelId = model.id;
      dispatch(assistantActions.setCurrentAssistant(modelId));
      dispatch(layoutActions.toggleDropdown(false));
      onNewChat(currentMsgList, dispatch, navigate, error);
    }
  };

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
      <div className="flex items-center justify-between">
        <button onClick={toggleSidebar} className="text-lg hover:text-gray-300">
          <BiChat />
        </button>
        <ModeDropDown onSelect={handleModeSelection} />
        <NewChat />
      </div>
    </header>
  );
};

export default ChatHeader;
