import { useRef, useState } from "react";
import ChatContainerScheduleBuilder from "./ChatContainerScheduleBuilder";
import ScheduleBuilderLogs from "./ScheduleBuilderLogs";
import { Button } from "@/components/ui/button";
import { IoMdChatboxes } from "react-icons/io";
import { useAppDispatch, scheduleBuilderLogActions } from "@/redux";
import ScheduleBuilderChatInput from "./ScheduleBuilderChatInput";

import SBNewChat from "./SBNewChat";
const ScheduleBuilderAIChat = () => {
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
    <>
      {/* sticky top bar */}
      <header className="sticky top-0 bg-slate-900 text-white p-1 z-40 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
        <div className="flex items-center justify-end gap-2">
          {/* ▸ give the button its own relative wrapper */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={onShowScheduleBuilderLogs}
              aria-label="Show schedule-builder logs"
            >
              <IoMdChatboxes className="w-5 h-5" />
            </Button>

            {/* ▸ panel mounts right next to the button */}
            {showLogs && (
              <ScheduleBuilderLogs onClose={onShowScheduleBuilderLogs} />
            )}
          </div>

          <SBNewChat />
        </div>
      </header>

      {/* central chat column (≈ ⅓ page width in parent) */}
      <ChatContainerScheduleBuilder />

      {/* bottom composer stub (still separate from the internal one) */}
      <ScheduleBuilderChatInput
        messagesContainerRef={messagesContainerRef}
        textAreaRef={textareaRef}
        sendButtonRef={sendButtonRef}
      />
    </>
  );
};

export default ScheduleBuilderAIChat;
