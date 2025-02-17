// FlowChatLayout.jsx
import React from "react";
import { SidebarFlowchart } from "@/components/flowchart/flowchartSidebar/SidebarFlowchart";

import DragDropContextWrapper from "../DragDropContxtWrapper";
import FlowchartUnitCounts from "@/components/flowchart/layout/FlowchartUnitCounts";
import { useAppSelector } from "@/redux";
import useMobile from "@/hooks/use-mobile";
import FlowchartHeader from "@/components/flowchart/layout/FlowchartHeader";

const FlowchartLayout = ({ children }: { children: React.ReactNode }) => {
  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const isMobile = useMobile();
  return (
    <DragDropContextWrapper>
      <SidebarFlowchart />
      <div
        className={`bg-slate-900 text-white min-h-screen flex flex-col overflow-hidden no-scroll w-full ${
          isMobile ? "mr-8" : "mr-16"
        }`}
      >
        <FlowchartHeader />
        <div className="flex-1">{children}</div>
        {/* Sticky footer */}
        {flowchartData && <FlowchartUnitCounts />}
      </div>
    </DragDropContextWrapper>
  );
};

export default FlowchartLayout;
