import React, { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
// Redux:
import { useSelector } from "react-redux";

const ChatContainer = () => {
  // Redux State Variables in uiMessage
  const msgList = useSelector((state) => state.message.msgList);
  console.log("MESSAFGE LIST: ", msgList);
  const logList = useSelector((state) => state.log.logList);
  // Referance to the DOM element of our messages container
  const messagesContainerRef = useRef(null);

  // When the a message gets added
  useEffect(() => {
    // scroll all the way to the bottom of the message container
    // Used for lengthy responses
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [msgList]);

  useEffect(() => {
    console.log("Log List: ", logList);
    // console.log("Msg List: ", msgList);
  }, [logList]);
  return (
    <div className="flex flex-col h-screen justify-between bg-white dark:bg-gray-800">
      <div
        ref={messagesContainerRef}
        className="messages-container overflow-auto p-4 pb-32"
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
