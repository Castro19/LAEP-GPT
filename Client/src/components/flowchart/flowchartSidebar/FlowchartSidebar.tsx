import { useEffect } from "react";
import styles from "./FlowchartSidebar.module.css";
// Redux:
import { useAppSelector, useAppDispatch } from "@/redux";
import { Button } from "@/components/ui/button";
import FlowchartLog from "../flowchartLog/FlowchartLog";
import { useUserData } from "@/hooks/useUserData";
import { setFlowchart } from "@/redux/flowchart/flowchartSlice";

const FlowchartSidebar = () => {
  const dispatch = useAppDispatch();
  //   const userId = useAppSelector((state) => state.auth.userId);

  //   const hasFetchedLogs = useRef(false);
  // Redux:
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );
  const flowchartList = useAppSelector(
    (state) => state.flowchart.flowchartList
  );
  const { handleChange } = useUserData();

  useEffect(() => {
    if (!flowchartList || flowchartList.length === 0) return;
    console.log("flowcharts: ", flowchartList);
  }, [flowchartList]);

  // Added transition classes and conditional translate classes
  const sidebarClasses = `fixed top-0 left-0 h-screen w-64 bg-slate-900 z-40 overflow-y-auto shadow-lg p-4 transition-transform duration-300 ease-in-out ${
    isSidebarVisible ? "translate-x-0" : "-translate-x-full"
  } border-r border-zinc-700`;

  // Handler for selecting a log to view
  const handleSelectFlowchart = (flowchartId: string) => {
    console.log("flowchartId: ", flowchartId);
    handleChange("flowchartId", flowchartId);
    dispatch(setFlowchart(flowchartId));
  };

  return (
    <aside className={`${sidebarClasses} flex flex-col h-full`}>
      <div className="relative text-gray-700 dark:text-white flex-shrink-0">
        <div className="flex justify-center items-center text-2xl border-b-2 border-zinc-800 pb-4">
          Flowcharts
        </div>
      </div>
      <div className="flex justify-center items-center w-full p-4">
        {/* Create new flowchart button */}
        <Button className="w-full">Create New Flowchart</Button>
      </div>
      <div
        className={`flex-grow overflow-y-auto overflow-x-hidden scroll-smooth ${styles.customScrollbar}`}
      >
        {flowchartList?.map((flowchart) => (
          <FlowchartLog
            key={flowchart.flowchartId}
            flowchart={flowchart}
            onSelectFlowchart={handleSelectFlowchart}
          />
        ))}
        {/* List of flowcharts */}
      </div>
    </aside>
  );
};

export default FlowchartSidebar;
