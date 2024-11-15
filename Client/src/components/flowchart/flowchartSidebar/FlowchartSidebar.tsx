import styles from "./FlowchartSidebar.module.css";
// Redux:
import { useAppSelector, useAppDispatch } from "@/redux";
import FlowchartLog from "../flowchartLog/FlowchartLog";
import { useUserData } from "@/hooks/useUserData";
import { setFlowchart } from "@/redux/flowchart/flowchartSlice";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const FlowchartSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  // Added transition classes and conditional translate classes
  const sidebarClasses = `fixed top-0 left-0 h-screen w-64 bg-slate-900 z-40 overflow-y-auto shadow-lg p-4 transition-transform duration-300 ease-in-out ${
    isSidebarVisible ? "translate-x-0" : "-translate-x-full"
  } border-r border-zinc-700`;

  // Handler for selecting a log to view
  const handleSelectFlowchart = (flowchartId: string) => {
    handleChange("flowchartId", flowchartId);
    dispatch(setFlowchart(flowchartId));
  };

  const handleBackToChat = () => {
    // Map back to the previous page
    navigate("/profile/edit");
  };

  return (
    <aside className={`${sidebarClasses} flex flex-col h-full`}>
      <div className="relative text-gray-700 dark:text-white flex-shrink-0">
        {/* Go Back Button */}
        <button
          onClick={handleBackToChat}
          className="absolute left-2 top-2 text-lg hover:text-gray-300"
        >
          <IoIosArrowBack />
        </button>
        <div className="flex justify-center items-center text-2xl border-b-2 border-zinc-800 pb-4">
          Flowcharts
        </div>
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
