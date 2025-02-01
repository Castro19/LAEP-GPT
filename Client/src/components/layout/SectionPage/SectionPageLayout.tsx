// FlowChatLayout.jsx
import React from "react";
import SectionPageSidebar from "./SectionPageSidebar";
import SectionPageHeader from "./SectionPageHeader";

const SectionPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="bg-slate-800 text-white flex flex-col w-full">
        <SectionPageHeader />
        <div className="flex-1">{children}</div>
      </div>
      <SectionPageSidebar />
    </>
  );
};

export default SectionPageLayout;
