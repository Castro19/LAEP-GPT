import { useEffect } from "react";
import FlowChart from "@/components/flowchart/FlowChart";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  fetchAllFlowcharts,
  setFlowchart,
} from "@/redux/flowchart/flowchartSlice";
import { useParams } from "react-router-dom";
// import FlowchartSidebar from "@/components/flowchart/flowchartSidebar/FlowchartSidebar";

import FlowChartLayout from "@/components/layout/flowchart/FlowchartLayout";
import { SidebarProvider } from "@/components/ui/sidebar";

const FlowChatPage = () => {
  const dispatch = useAppDispatch();
  const { flowchartId } = useParams();
  const { flowchartData } = useAppSelector((state) => state.flowchart);

  useEffect(() => {
    // Only fetch if we have a flowchartId and no data yet
    if (flowchartId && !flowchartData) {
      dispatch(setFlowchart(flowchartId));
    }
  }, [flowchartId, flowchartData, dispatch]);

  useEffect(() => {
    dispatch(fetchAllFlowcharts());
  }, [dispatch]);

  return (
    <SidebarProvider>
      <FlowChartLayout>
        <FlowChart flowchartData={flowchartData} />
      </FlowChartLayout>
    </SidebarProvider>
  );
};

export default FlowChatPage;
