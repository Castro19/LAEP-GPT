import { useRef } from "react";
import ChatContainerScheduleBuilder from "./ChatContainerScheduleBuilder";
import ScheduleBuilderChatInput from "./ScheduleBuilderChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  currentHeight: number;
}

const ScheduleBuilderAIChat: React.FC<Props> = ({ currentHeight }) => {
  /* refs for ChatInput – still stubs */
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="h-full flex flex-col">
      {/* Chat container with ScrollArea */}
      <div className="flex-1 min-h-0">
        <div style={{ height: `${currentHeight - 8 * 16}px` }}>
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
