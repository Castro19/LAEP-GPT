// FlowChatLayout.jsx
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/flowchart/flowchartSidebar/SidebarFlowchart";
import FlowChartHeader from "@/components/flowchart/flowchartHeader/FlowChartHeader";
import FlowChartFooter from "@/components/flowchart/flowchartFooter/FlowChartFooter";

const FlowChartLayout = ({ children }: { children: React.ReactNode }) => {
  const { open } = useSidebar();

  return (
    <div
      className={`bg-slate-800 text-white min-h-screen flex flex-col transition-all duration-300 overflow-y-auto ${
        open ? "ml-64" : "ml-0"
      }`}
    >
      <FlowChartHeader />
      <AppSidebar />
      <div className="flex-1">{children}</div>
      <FlowChartFooter />
    </div>
  );
};

export default FlowChartLayout;
