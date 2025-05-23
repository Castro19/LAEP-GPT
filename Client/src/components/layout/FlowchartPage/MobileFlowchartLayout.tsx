import DragDropContextWrapper from "@/components/layout/dnd/DragDropContextWrapper";
import FlowchartHeader from "@/components/layout/FlowchartPage/FlowchartHeader";
import MobileHeader from "../dynamicLayouts/MobileHeader";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const MobileFlowchartLayout = ({ children }: { children: React.ReactNode }) => {
  const isNarrowScreen = useIsNarrowScreen();
  return (
    <DragDropContextWrapper>
      <div id="draggable-portal"></div>
      <div className="bg-slate-900 text-white min-h-screen flex flex-col overflow-hidden no-scroll w-full">
        {isNarrowScreen ? <MobileHeader /> : <FlowchartHeader />}
        <div className="flex-1 overflow-y-auto w-full">{children}</div>
      </div>
    </DragDropContextWrapper>
  );
};

export default MobileFlowchartLayout;
