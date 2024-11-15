import { useEffect } from "react";
import FlowChart from "@/components/flowchart/FlowChart";
import FlowChartHeader from "@/components/flowchart/flowchartHeader/FlowChartHeader";
import FlowChartFooter from "@/components/flowchart/flowchartFooter/FlowChartFooter";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  fetchAllFlowcharts,
  setFlowchart,
} from "@/redux/flowchart/flowchartSlice";
import { useParams } from "react-router-dom";
import FlowchartSidebar from "@/components/flowchart/flowchartSidebar/FlowchartSidebar";

const FlowChatPage = () => {
  const dispatch = useAppDispatch();

  const { flowchartId } = useParams();
  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );

  useEffect(() => {
    // Only fetch if we have a flowchartId and no data yet
    if (flowchartId && !flowchartData) {
      dispatch(setFlowchart(flowchartId));
    }
  }, [flowchartId, flowchartData, dispatch]);

  useEffect(() => {
    dispatch(fetchAllFlowcharts());
  }, [dispatch]);

  // Determine if flowchart data is loading
  // const isFlowchartDataLoading =
  //   loading.fetchFlowchartData || loading.setFlowchart;

  // // Show loading state while fetching or if we don't have data yet
  // if (isFlowchartDataLoading || (!flowchartData && flowchartId)) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <div
        className={`bg-slate-800 text-white min-h-screen flex flex-col transition-all duration-300 overflow-y-auto ${
          isSidebarVisible ? "ml-64" : ""
        }`}
      >
        <FlowchartSidebar />
        <FlowChartHeader />
        <div className="flex-1">
          <FlowChart flowchartData={flowchartData} />
        </div>
        <FlowChartFooter />
      </div>
    </>
  );
};

export default FlowChatPage;
