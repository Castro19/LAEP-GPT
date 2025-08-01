/**
 * @component MobileChatContainer
 * @description Mobile-optimized version of ChatContainer. Handles chat interface with mobile-specific
 * layout adjustments and safe area insets for modern mobile devices.
 *
 * @features
 * - Fixed footer with safe area inset for mobile keyboards
 * - Reduced height (70%) for better mobile viewport usage
 * - Maintains auto-scroll behavior from base container
 * - Uses safe-bottom-inset to prevent footer overlap with mobile navigation
 *
 * @props
 * None - Uses Redux state for messages and chat status
 *
 * @dependencies
 * - Redux: messagesByChatId, isNewChat, loading, currentChatId
 * - ScrollArea: For scrollable message container
 *
 * @behavior
 * - Inherits base chat container functionality
 * - Adapts layout for mobile viewport
 * - Handles mobile keyboard interactions
 * - Maintains scroll position management
 * - Prevents footer overlap with mobile navigation using safe-bottom-inset
 */

import { useEffect, useRef, useState } from "react";
import { ChatInput, ChatMessage } from "@/components/chat";
import AssistantSuggestedMessages from "./AssistantSuggestedMessages";
// Redux:
import { useAppSelector } from "@/redux";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageObjType } from "@polylink/shared/types";

const MobileChatContainer = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const { messagesByChatId, isNewChat, loading, currentChatId } =
    useAppSelector((state) => state.message);
  const [msgList, setMsgList] = useState<MessageObjType[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);

  useEffect(() => {
    if (currentChatId && messagesByChatId[currentChatId]) {
      setMsgList(messagesByChatId[currentChatId].content);
    }
  }, [messagesByChatId, currentChatId]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    isUserAtBottomRef.current = checkIfUserAtBottom();

    const handleScroll = () => {
      isUserAtBottomRef.current = checkIfUserAtBottom();
    };

    messagesContainer.addEventListener("scroll", handleScroll);
    return () => messagesContainer.removeEventListener("scroll", handleScroll);
  }, [isNewChat]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    if (isUserAtBottomRef.current || msgList.length <= 1) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [msgList]);

  const checkIfUserAtBottom = () => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return true;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
    return Math.abs(scrollHeight - clientHeight - scrollTop) < 20;
  };
  return (
    <div className="flex flex-col h-screen bg-slate-900 ">
      <div className={`flex flex-col h-[70%] bg-slate-900`}>
        {/* Only one flex child grows: our message list */}
        {isNewChat && !loading[currentChatId ?? ""] ? (
          <AssistantSuggestedMessages sendButtonRef={sendButtonRef} />
        ) : (
          <ScrollArea
            ref={messagesContainerRef}
            className="flex-1" // Ensures this area gets only the remaining space
          >
            <div className="p-4">
              {msgList.map((message) => (
                <ChatMessage key={message.id} msg={message} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      <footer className="safe-bottom-inset fixed bottom-0 w-full">
        <ChatInput
          messagesContainerRef={messagesContainerRef}
          textareaRef={textareaRef}
          sendButtonRef={sendButtonRef}
        />
      </footer>
    </div>
  );
};

export default MobileChatContainer;
