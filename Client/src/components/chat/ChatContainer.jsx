import React, { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
// Redux:
import { useSelector } from "react-redux";
const ChatContainer = () => {
  const msgList = useSelector((state) => state.message.msgList);
  const logList = useSelector((state) => state.log.logList);
  const messagesContainerRef = useRef(null);

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
