// FlowChatLayout.jsx
import React from "react";
import ChatPageHeader from "./ChatPageHeader";
import Sidebar from "../sidebar/Sidebar";

const ChatPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar />
      <div className="bg-slate-800 text-white min-h-screen flex flex-col no-scroll w-full">
        <ChatPageHeader />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
};

export default ChatPageLayout;
