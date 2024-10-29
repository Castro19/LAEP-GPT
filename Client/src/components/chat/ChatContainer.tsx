import { useEffect, useRef } from "react";
import { ChatInput, ChatMessage } from "@/components/chat";
// Redux:
import { useAppSelector } from "@/redux";

const ChatContainer = () => {
  const msgList = useAppSelector((state) => state.message.msgList);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
        // Check if the user is at the bottom (allowing a small offset)
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        isUserAtBottomRef.current = isAtBottom;
      };
      messagesContainer.addEventListener("scroll", handleScroll);

      // Clean up the event listener on unmount
      return () => {
        messagesContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer && isUserAtBottomRef.current) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [msgList]);

  return (
    <div className="flex flex-col h-screen justify-between bg-white dark:bg-gray-800 ">
      <div ref={messagesContainerRef} className="flex-1 overflow-auto p-4">
        {msgList.map((message) => (
          <ChatMessage key={message.id} msg={message} />
        ))}
      </div>
      <ChatInput messagesContainerRef={messagesContainerRef} />
    </div>
  );
};

export default ChatContainer;
