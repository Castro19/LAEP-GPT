// FlowChatLayout.jsx
import React from "react";
import SplashHeader from "./SplashHeader";
import SplashFooter from "./SplashFooter";

const ChatPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background min-h-screen relative">
      <SplashHeader />
      <div className="relative">
        <div className="flex-1">{children}</div>
      </div>
      <SplashFooter />
    </div>
  );
};

export default ChatPageLayout;
