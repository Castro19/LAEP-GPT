import { useEffect, useRef } from "react";
import { ChatInput, ChatMessage } from "@/components/chat";
// Redux:
import { useAppSelector } from "@/redux";

const ChatContainer = () => {
  const msgList = useAppSelector((state) => state.message.msgList);
  const logList = useAppSelector((state) => state.log.logList);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [msgList]);

  useEffect(() => {
    console.log("Log List: ", logList);
  }, [logList]);

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
