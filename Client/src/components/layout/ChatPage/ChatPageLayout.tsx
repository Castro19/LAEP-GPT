// FlowChatLayout.jsx
import React from "react";
import ChatPageHeader from "./ChatPageHeader";
import { ChatPageSidebar } from "./ChatPageSidebar";

const ChatPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ChatPageSidebar />
      <div className="bg-slate-800 text-white min-h-screen flex flex-col no-scroll w-full">
        <ChatPageHeader />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
};

export default ChatPageLayout;
