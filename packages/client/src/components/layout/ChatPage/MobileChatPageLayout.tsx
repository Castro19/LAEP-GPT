// ChatPageLayout.tsx
import React from "react";
import ChatPageHeader from "./ChatPageHeader";
import { ChatPageSidebar } from "./ChatPageSidebar";

const ChatPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ChatPageSidebar />
      <div
        className="bg-slate-800 text-white min-h-screen flex flex-col w-full overflow-hidden overscroll-none touch-none"
        style={{
          // Prevent default scrolling on the body
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <ChatPageHeader />
        <div
          className="flex-1"
          style={{
            // Allow scrolling within this div while hiding scrollbars
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // Internet Explorer/Edge
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default ChatPageLayout;
