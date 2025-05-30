// FlowchartLayout.tsx

// My components
import DragDropContextWrapper from "@/components/layout/dnd/DragDropContextWrapper";
import MobileHeader from "../dynamicLayouts/MobileHeader";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

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
        {isNarrowScreen ? <MobileHeader /> : null}
        <div className="flex-1">{children}</div>
      </div>
    </DragDropContextWrapper>
  );
};

export default FlowchartLayout;
