// FlowChatLayout.jsx
import React from "react";
import SectionPageSidebar from "./SectionPageSidebar";
import SectionPageHeader from "./SectionPageHeader";

const SectionPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SectionPageSidebar />
      <div className="bg-slate-800 text-white min-h-screen flex flex-col no-scroll w-full">
        <SectionPageHeader />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
};

export default SectionPageLayout;
