import React from "react";
import { useParams } from "react-router-dom";

import ChatContainer from "@/components/chat/ChatContainer";
import ChatHeader from "@/components/layout/Header";

const ChatPage = () => {
  const { chatId } = useParams();
  console.log("Chat id in page: ", chatId);
  return (
    <div>
      <ChatHeader />
      <ChatContainer />
    </div>
  );
};

export default ChatPage;
