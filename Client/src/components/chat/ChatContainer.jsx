import React, { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useMessage } from "../contexts/MessageContext";
import { useUI } from "../contexts/UIContext";

const ChatContainer = () => {
  // Context State Vars:
  const { msgList, setMsgList, logList } = useMessage();
  const { currentChatId, setIsNewChat } = useUI();

  // Referance to the DOM element of our messages container
  const messagesContainerRef = useRef(null);

  // When the a message gets added, do the following:
  useEffect(() => {
    console.log(logList);
    // 1.) scroll all the way to the bottom of the message container
    // Used for lengthy responses
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    // 2.) Handle new chat logs
    if (msgList.length > 1) setIsNewChat(false);
    else setIsNewChat(true);
  }, [msgList]);

  useEffect(() => {
    if (logList.length > 0) {
      console.log("ID: ", currentChatId);
      if (logList[currentChatId]) {
        setMsgList(logList[currentChatId].content);
      } else {
        setMsgList([]);
      }
    }
  }, [currentChatId]);

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
        messagesContainerRef={messagesContainerRef} // Passing the ref as a prop
      />
    </div>
  );
};

export default ChatContainer;
