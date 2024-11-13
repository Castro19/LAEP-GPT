import { useEffect } from "react";
import FlowChart from "@/components/flowchart/FlowChart";
import FlowChartHeader from "@/components/flowchart/flowchartHeader/FlowChartHeader";
import FlowChartFooter from "@/components/flowchart/flowchartFooter/FlowChartFooter";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setFlowchart } from "@/redux/flowchart/flowchartSlice";
import { useParams } from "react-router-dom";

const FlowChatPage = () => {
  const dispatch = useAppDispatch();
  const { flowchartId } = useParams();
  const { flowchartData, loading } = useAppSelector((state) => state.flowchart);
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );

  useEffect(() => {
    // Only fetch if we have a flowchartId and no data yet
    if (flowchartId && !flowchartData) {
      dispatch(setFlowchart(flowchartId));
    }
  }, [flowchartId, flowchartData, dispatch]);

  // Determine if flowchart data is loading
  const isFlowchartDataLoading =
    loading.fetchFlowchartData || loading.setFlowchart;

  // Show loading state while fetching or if we don't have data yet
  if (isFlowchartDataLoading || (!flowchartData && flowchartId)) {
    return <div>Loading...</div>;
  }

  // If we don't have data and no flowchartId, something went wrong
  if (!flowchartData && !flowchartId) {
    return <div>No flowchart data available</div>;
  }

  return (
    <>
      {flowchartData && (
        <div className="flex flex-col h-screen dark:bg-gray-900">
          <FlowChartHeader />
          <div
            className={`flex-grow overflow-auto ${
              isSidebarVisible ? "ml-64" : ""
            }`}
          >
            <FlowChart flowchartData={flowchartData} />
          </div>
          <FlowChartFooter />
        </div>
      )}
    </>
  );
};

export default FlowChatPage;
