// FlowchartLayout.tsx

// Redux
import { useAppSelector } from "@/redux";

// My components
import { SidebarFlowchart, FlowchartUnitCounts } from "@/components/flowchart";
import DragDropContextWrapper from "@/components/layout/dnd/DragDropContextWrapper";
import FlowchartHeader from "@/components/layout/FlowchartPage/FlowchartHeader";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const FlowchartLayout = ({ children }: { children: React.ReactNode }) => {
  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const isNarrowScreen = useIsNarrowScreen();
  return (
    <DragDropContextWrapper>
      <SidebarFlowchart />
      <div id="draggable-portal"></div>
      <div
        className={`bg-slate-900 text-white min-h-screen flex flex-col overflow-hidden no-scroll w-full ${
          isNarrowScreen ? "mr-8" : "mr-16"
        }`}
      >
        <FlowchartHeader />
        <div className="flex-1">{children}</div>
        {/* Sticky footer */}
        {flowchartData && !isNarrowScreen && <FlowchartUnitCounts />}
      </div>
    </DragDropContextWrapper>
  );
};

export default FlowchartLayout;
