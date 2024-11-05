import { useEffect, useRef } from "react";
import { ChatInput, ChatMessage } from "@/components/chat";
import AssistantSuggestedMessages from "./AssistantSuggestedMessages";
// Redux:
import { useAppSelector } from "@/redux";

const ChatContainer = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const { msgList, isNewChat, isLoading } = useAppSelector(
    (state) => state.message
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);

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
    <div className="flex flex-col h-screen justify-between bg-slate-900">
      {isNewChat && !isLoading ? (
        <AssistantSuggestedMessages sendButtonRef={sendButtonRef} />
      ) : (
        <div ref={messagesContainerRef} className="flex-1 overflow-auto p-4">
          {msgList.map((message) => (
            <ChatMessage key={message.id} msg={message} />
          ))}
        </div>
      )}
      <ChatInput
        messagesContainerRef={messagesContainerRef}
        textareaRef={textareaRef}
        sendButtonRef={sendButtonRef}
      />
    </div>
  );
};

export default ChatContainer;
