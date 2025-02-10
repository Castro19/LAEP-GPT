// FlowChatLayout.jsx
import React from "react";
import { SidebarFlowchart } from "@/components/flowchart/flowchartSidebar/SidebarFlowchart";
import FlowChartHeader from "@/components/flowchart/flowchartHeader/FlowChartHeader";

import DragDropContextWrapper from "../DragDropContxtWrapper";
import FlowchartUnitCounts from "@/components/flowchart/flowchartFooter/FlowchartUnitCounts";

const FlowChartLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DragDropContextWrapper>
      <SidebarFlowchart />
      <div className="bg-slate-900 text-white min-h-screen flex flex-col overflow-hidden no-scroll w-full mr-16">
        <FlowChartHeader />
        <div className="flex-1">{children}</div>
        {/* Sticky footer */}
        <FlowchartUnitCounts />
      </div>
    </DragDropContextWrapper>
  );
};

export default FlowChartLayout;
