import { useRef, useState } from "react";
import { ChatInput, NewChat } from "@/components/chat";
import ChatContainerScheduleBuilder from "./ChatContainerScheduleBuilder";
import ScheduleBuilderLogs from "./ScheduleBuilderLogs";
import { Button } from "@/components/ui/button";
import { IoMdChatboxes } from "react-icons/io";

const ScheduleBuilderAIChat = () => {
  /* refs for ChatInput – still stubs */
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  /* local UI-state */
  const [showLogs, setShowLogs] = useState(false);

  const onShowScheduleBuilderLogs = () => {
    console.log("show schedule builder logs");
    if (showLogs) {
      setShowLogs(false);
    } else {
      // fetch logs from database
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

          <NewChat />
        </div>
      </header>

      {/* central chat column (≈ ⅓ page width in parent) */}
      <ChatContainerScheduleBuilder />

      {/* bottom composer stub (still separate from the internal one) */}
      <ChatInput
        messagesContainerRef={messagesContainerRef}
        textareaRef={textareaRef}
        sendButtonRef={sendButtonRef}
      />
    </>
  );
};

export default ScheduleBuilderAIChat;
