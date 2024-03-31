import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const ChatContainer = () => {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [msgList]);

  return (
    <div className="flex flex-col h-screen justify-between bg-white dark:bg-gray-800">
      <div
        ref={messagesContainerRef}
        className="messages-container overflow-auto p-4 pb-16"
      >
        {/* Messages will go here */}
        {msgList.map((message) => (
          <ChatMessage key={message.id} msg={message} />
        ))}
      </div>

      <ChatInput
        msg={msg}
        setMsg={setMsg}
        msgList={msgList}
        setMsgList={setMsgList}
        messagesContainerRef={messagesContainerRef} // Passing the ref as a prop
      />
    </div>
  );
};

export default ChatContainer;
