// My components:
import {
  ChatContainerScheduleBuilder,
  ScheduleBuilderChatInput,
} from "@/components/scheduleBuilder/aiChat";
// UI components:
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * ScheduleBuilderAIChat - Main AI chat interface for schedule building
 *
 * This component provides the primary chat interface for the schedule builder,
 * combining a scrollable message container with a fixed input area. It manages
 * the layout and height calculations for optimal user experience.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.currentHeight - Current height of the parent container
 * @param {React.RefObject<HTMLButtonElement>} props.sendButtonRef - Reference to the send button
 * @param {React.RefObject<HTMLDivElement>} props.messagesContainerRef - Reference to the messages container
 * @param {React.RefObject<HTMLTextAreaElement>} props.textareaRef - Reference to the textarea input
 *
 * @example
 * ```tsx
 * <ScheduleBuilderAIChat
 *   currentHeight={600}
 *   sendButtonRef={sendButtonRef}
 *   messagesContainerRef={messagesContainerRef}
 *   textareaRef={textareaRef}
 * />
 * ```
 *
 * @dependencies
 * - ChatContainerScheduleBuilder for message display
 * - ScheduleBuilderChatInput for user input
 * - ScrollArea for scrollable message container
 *
 * @features
 * - Responsive height calculation based on parent container
 * - Scrollable message area with proper overflow handling
 * - Fixed input area at the bottom
 * - Proper ref forwarding for external control
 * - Dark theme styling
 *
 * @layout
 * - Flex column layout for vertical stacking
 * - Dynamic height calculation for message container
 * - Fixed height for input area (h-20)
 * - Proper spacing and padding
 *
 * @styling
 * - Dark theme with slate colors
 * - Consistent spacing and layout
 * - Responsive design considerations
 * - Proper overflow handling
 */
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
