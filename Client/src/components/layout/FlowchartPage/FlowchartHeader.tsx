// FlowchartHeader.tsx
// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const FlowchartHeader = () => {
  const isNarrowScreen = useIsNarrowScreen();

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-1 z-50 border-b-2 dark:border-slate-700 shadow-md transition-all duration-300 ml-2">
      <div className="flex items-center justify-between relative w-full">
        <div className="flex-1 flex items-center justify-center">
          <h1 className={`${isNarrowScreen ? "text-sm" : "text-lg"} font-bold`}>
            Flowchart
          </h1>
        </div>
      </div>
    </header>
  );
};

export default FlowchartHeader;
