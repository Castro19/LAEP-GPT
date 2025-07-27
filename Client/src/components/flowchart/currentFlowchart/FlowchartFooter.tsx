import FlowchartActions from "@/components/flowchart/currentFlowchart/FlowchartActions";
import { UnitCategories } from "./UnitCategories";
import { TotalUnits } from "./TotalUnits";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const FlowchartFooter = () => {
  const isNarrowScreen = useIsNarrowScreen();

  return (
    <div
      className="dark:bg-gray-900 sticky bottom-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
    <div className="space-y-4 mx-5 text-lg">
        {/* Top section with actions and unit categories */}
        <div className={`${isNarrowScreen ? "flex-row" : "flex justify-between items-center"}`}>
          <UnitCategories />
          {!isNarrowScreen && <FlowchartActions />}
        </div>

        {/* Bottom section with total units */}
        <div className={`flex ${isNarrowScreen ? "justify-between" : "justify-center"} items-center border-t pt-2 dark:border-gray-700`}>
          <TotalUnits />
          {isNarrowScreen && <FlowchartActions />}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex justify-center text-sm text-gray-500 p-2">
        Consult an advisor for accurate academic progress.
      </div>
    </div>
  )
}

export default FlowchartFooter;