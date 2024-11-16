// FlowChatLayout.jsx
import React from "react";

import { AppSidebar } from "@/components/flowchart/flowchartSidebar/SidebarFlowchart";
import FlowChartHeader from "@/components/flowchart/flowchartHeader/FlowChartHeader";
import FlowChartFooter from "@/components/flowchart/flowchartFooter/FlowChartFooter";

const FlowChartLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppSidebar />
      <div className="bg-slate-800 text-white min-h-screen flex flex-col overflow-y-auto">
        <FlowChartHeader />
        <div className="flex-1">{children}</div>
        <FlowChartFooter />
      </div>
    </>
  );
};

export default FlowChartLayout;
