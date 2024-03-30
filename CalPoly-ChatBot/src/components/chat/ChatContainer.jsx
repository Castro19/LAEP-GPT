import React, { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const ChatContainer = () => {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);

  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="overflow-auto">
        {/* Messages will go here */}
        ChatContainer
      </div>
      <ChatInput
        msg={msg}
        setMsg={setMsg}
        msgList={msgList}
        setMsgList={setMsgList}
      />
    </div>
  );
};

export default ChatContainer;
