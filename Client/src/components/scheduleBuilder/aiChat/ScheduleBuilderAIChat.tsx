import { useRef, useState } from "react";
import ChatContainerScheduleBuilder from "./ChatContainerScheduleBuilder";
import ScheduleBuilderLogs from "./ScheduleBuilderLogs";
import { Button } from "@/components/ui/button";
import { IoMdChatboxes } from "react-icons/io";
import { useAppDispatch, scheduleBuilderLogActions } from "@/redux";
import ScheduleBuilderChatInput from "./ScheduleBuilderChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import SBNewChat from "./SBNewChat";

interface Props {
  currentHeight: number;
}

const ScheduleBuilderAIChat: React.FC<Props> = ({ currentHeight }) => {
  const dispatch = useAppDispatch();
  /* refs for ChatInput – still stubs */
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  /* local UI-state */
  const [showLogs, setShowLogs] = useState(false);

  const onShowScheduleBuilderLogs = () => {
    if (showLogs) {
      setShowLogs(false);
    } else {
      // fetch logs from database
      dispatch(scheduleBuilderLogActions.fetchAllLogs());
      setShowLogs(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with fixed height */}
      <header className="h-12 bg-slate-900 text-white p-1 z-40 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
        <div className="flex items-center justify-end gap-2 h-full">
          <div className="relative">
            <Button
              variant="ghost"
              onClick={onShowScheduleBuilderLogs}
              aria-label="Show schedule-builder logs"
            >
              <IoMdChatboxes className="w-5 h-5" />
            </Button>
            {showLogs && (
              <ScheduleBuilderLogs onClose={onShowScheduleBuilderLogs} />
            )}
          </div>
          <SBNewChat />
        </div>
      </header>

      {/* Chat container with ScrollArea */}
      <div className="flex-1 min-h-0">
        <div style={{ height: `${currentHeight - 12 * 16}px` }}>
          <ScrollArea className="h-full">
            <ChatContainerScheduleBuilder sendButtonRef={sendButtonRef} />
          </ScrollArea>
        </div>
      </div>

      {/* Chat input with fixed height */}
      <div className="h-16 bg-slate-900">
        <ScheduleBuilderChatInput
          messagesContainerRef={messagesContainerRef}
          textAreaRef={textareaRef}
          sendButtonRef={sendButtonRef}
        />
      </div>
    </div>
  );
};

export default ScheduleBuilderAIChat;
