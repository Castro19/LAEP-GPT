// FlowchartHeader.tsx
// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const FlowchartHeader = () => {
  const isNarrowScreen = useIsNarrowScreen();

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 dark:border-slate-700 shadow-md transition-all duration-300 ml-2">
      <div className="flex items-center justify-between relative w-full">
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`${
              isNarrowScreen ? "text-sm" : "text-2xl"
            } font-bold leading-tight text-center`}
          >
            Flowchart
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>
    </header>
  );
};

export default FlowchartHeader;
