import ModeDropDown from "../../customGPT/ModeDropDown";
import { useSidebar } from "@/components/ui/sidebar";
import NewChat from "../../chat/NewChat";
import { GptType } from "@/types";
import { BiChat } from "react-icons/bi";
// Redux:
import { useAppDispatch, gptActions, layoutActions } from "@/redux";

const ChatHeader = () => {
  // Redux:
  const dispatch = useAppDispatch();
  const { toggleSidebar } = useSidebar();

  const handleModeSelection = (model: GptType) => {
    if (model && model.id) {
      const modelId = model.id;
      dispatch(gptActions.setCurrentGpt(modelId));
      dispatch(layoutActions.toggleDropdown(false));
    }
  };

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-x-gray-500 shadow-md">
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
