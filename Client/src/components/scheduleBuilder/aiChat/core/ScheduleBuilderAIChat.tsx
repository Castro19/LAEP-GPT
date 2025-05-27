// My components:
import {
  ChatContainerScheduleBuilder,
  ScheduleBuilderChatInput,
} from "@/components/scheduleBuilder/aiChat";
// UI components:
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  currentHeight: number;
  sendButtonRef: React.RefObject<HTMLButtonElement>;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const ScheduleBuilderAIChat: React.FC<Props> = ({
  currentHeight,
  sendButtonRef,
  messagesContainerRef,
  textareaRef,
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Chat container with ScrollArea */}
      <div className="flex-1 min-h-0">
        <div style={{ height: `${currentHeight - 10 * 16}px` }}>
          <ScrollArea className="h-full">
            <ChatContainerScheduleBuilder sendButtonRef={sendButtonRef} />
          </ScrollArea>
        </div>
      </div>

      {/* Chat input with fixed height */}
      <div className="h-20 bg-slate-900">
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
