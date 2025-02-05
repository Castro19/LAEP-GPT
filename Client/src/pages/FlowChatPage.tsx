import { useEffect, useRef } from "react";
import FlowChart from "@/components/flowchart/FlowChart";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  fetchAllFlowcharts,
  setFlowchart,
} from "@/redux/flowchart/flowchartSlice";
// import FlowchartSidebar from "@/components/flowchart/flowchartSidebar/FlowchartSidebar";

import FlowChartLayout from "@/components/layout/flowchart/FlowchartLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useParams } from "react-router-dom";
import OuterSidebar from "@/components/layout/OuterIconSidebar";

const FlowChatPage = () => {
  const dispatch = useAppDispatch();
  const { flowchartId } = useParams();
  const { flowchartData, loading } = useAppSelector((state) => state.flowchart);
  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const initializeFlowcharts = async () => {
      await dispatch(fetchAllFlowcharts());

      if (flowchartId && !flowchartData && !loading.deleteFlowchart) {
        dispatch(setFlowchart(flowchartId));
      }
    };

    initializeFlowcharts();
  }, [flowchartId, flowchartData, dispatch, loading.deleteFlowchart]);

  return (
    <>
      <div className="flex overflow-hidden">
        <OuterSidebar />
        <SidebarProvider>
          <FlowChartLayout>
            <FlowChart flowchartData={flowchartData} />
          </FlowChartLayout>
        </SidebarProvider>
      </div>
    </>
  );
};

export default FlowChatPage;
