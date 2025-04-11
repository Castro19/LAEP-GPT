import { SidebarFlowchart } from "@/components/flowchart";
import DragDropContextWrapper from "@/components/layout/dnd/DragDropContextWrapper";
import FlowchartHeader from "@/components/layout/FlowchartPage/FlowchartHeader";

const MobileFlowchartLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DragDropContextWrapper>
      <SidebarFlowchart />
      <div id="draggable-portal"></div>
      <div className="bg-slate-900 text-white min-h-screen flex flex-col overflow-hidden no-scroll w-full">
        <FlowchartHeader />
        <div className="flex-1 overflow-y-auto pb-4 w-full">{children}</div>
      </div>
    </DragDropContextWrapper>
  );
};

export default MobileFlowchartLayout;
