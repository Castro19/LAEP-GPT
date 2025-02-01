import { ChatContainer } from "@/components/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import ModeDropDown from "@/components/chat/ModeDropDown";
import { layoutActions, useAppDispatch, useAppSelector } from "@/redux";
import { assistantActions } from "@/redux";
import { onNewChat } from "@/components/chat/helpers/newChatHandler";
import { AssistantType } from "@polylink/shared/types";
import { useNavigate } from "react-router-dom";

const SectionPageSidebar = () => {
  const dispatch = useAppDispatch();
  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );
  const error = useAppSelector((state) => state.message.error);
  const navigate = useNavigate();

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
        messagesByChatId,
        true
      );
    }
  };

  return (
    <Sidebar
      resizable={true}
      className="flex flex-col h-full"
      side="right"
      variant="inset"
    >
      <SidebarHeader className="mt-4 border-b border-sidebar-border dark:border-slate-700 flex justify-center items-center">
        <ModeDropDown onSelect={handleModeSelection} />
      </SidebarHeader>
      <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
        <ScrollArea className="h-full">
          <ChatContainer />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default SectionPageSidebar;
