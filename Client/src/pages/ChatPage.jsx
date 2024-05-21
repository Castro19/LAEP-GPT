import React from "react";
import { useParams } from "react-router-dom";

import ChatContainer from "@/components/chat/ChatContainer";
import ChatHeader from "@/components/layout/Header";

import { useSelector } from "react-redux";

const ChatPage = () => {
  const { chatId } = useParams();
  console.log("Chat id in page: ", chatId);
  const isSidebarVisible = useSelector(
    (state) => state.layout.isSidebarVisible
  );

  return (
    <div
      className={`dark:bg-gray-800 dark:text-white min-h-screen p-4 transition-all duration-300 ${
        isSidebarVisible ? "ml-64" : ""
      }`}
    >
      <ChatHeader />
      <ChatContainer />
    </div>
  );
};

export default ChatPage;
