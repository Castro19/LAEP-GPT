// FlowChatLayout.jsx
import React from "react";
import { SidebarFlowchart } from "@/components/flowchart/flowchartSidebar/SidebarFlowchart";
import FlowChartHeader from "@/components/flowchart/flowchartHeader/FlowChartHeader";
import FlowChartFooter from "@/components/flowchart/flowchartFooter/FlowChartFooter";

import DragDropContextWrapper from "../DragDropContxtWrapper";

const FlowChartLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DragDropContextWrapper>
      <SidebarFlowchart />
      <div className="bg-slate-900 text-white min-h-screen flex flex-col no-scroll w-full">
        <FlowChartHeader />
        <div className="flex-1 overflow-y-auto">{children}</div>
        <FlowChartFooter />
      </div>
    </DragDropContextWrapper>
  );
};

export default FlowChartLayout;
