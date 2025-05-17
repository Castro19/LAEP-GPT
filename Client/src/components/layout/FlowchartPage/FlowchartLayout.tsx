// FlowchartLayout.tsx

// My components
import DragDropContextWrapper from "@/components/layout/dnd/DragDropContextWrapper";
import FlowchartHeader from "@/components/layout/FlowchartPage/FlowchartHeader";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import MobileHeader from "../dynamicLayouts/MobileHeader";

const FlowchartLayout = ({ children }: { children: React.ReactNode }) => {
  const isNarrowScreen = useIsNarrowScreen();
  return (
    <DragDropContextWrapper>
      <div id="draggable-portal"></div>
      <div
        className={`bg-slate-900 text-white min-h-screen flex flex-col overflow-hidden no-scroll w-full ${
          isNarrowScreen ? "mr-8" : "mr-16"
        }`}
      >
        {isNarrowScreen ? <MobileHeader /> : <FlowchartHeader />}
        <div className="flex-1">{children}</div>
      </div>
    </DragDropContextWrapper>
  );
};

export default FlowchartLayout;
