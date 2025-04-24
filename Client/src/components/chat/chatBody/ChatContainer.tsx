import { useEffect, useRef, useState } from "react";
import { ChatInput, ChatMessage } from "@/components/chat";
import AssistantSuggestedMessages from "./AssistantSuggestedMessages";
// Redux:
import { useAppSelector } from "@/redux";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageObjType } from "@polylink/shared/types";

const ChatContainer = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const { messagesByChatId, isNewChat, loading, currentChatId } =
    useAppSelector((state) => state.message);
  const [msgList, setMsgList] = useState<MessageObjType[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);

  // Tech Debt IMO (Fix later)
  const chatContainerHeight = location.pathname.includes("/chat")
    ? "h-[85%]"
    : "h-[77%]";
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
    <div className="flex flex-col h-screen bg-background">
      <div className={`flex flex-col ${chatContainerHeight} bg-background`}>
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
      <ChatInput
        messagesContainerRef={messagesContainerRef}
        textareaRef={textareaRef}
        sendButtonRef={sendButtonRef}
      />
    </div>
  );
};

export default ChatContainer;
