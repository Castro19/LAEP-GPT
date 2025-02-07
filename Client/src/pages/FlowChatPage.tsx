import { useEffect, useRef } from "react";
import FlowChart from "@/components/flowchart/FlowChart";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  fetchAllFlowcharts,
  setFlowchart,
} from "@/redux/flowchart/flowchartSlice";
import FlowChartLayout from "@/components/layout/flowchart/FlowchartLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import OuterSidebar from "@/components/layout/OuterIconSidebar";
import EmptyFlowchart from "@/components/flowchart/EmptyFlowchart";
import { useParams } from "react-router-dom";

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
        <SidebarProvider className="dark:bg-slate-900">
          <FlowChartLayout>
            {flowchartData ? (
              <FlowChart flowchartData={flowchartData} />
            ) : (
              <EmptyFlowchart />
            )}
          </FlowChartLayout>
        </SidebarProvider>
      </div>
    </>
  );
};

export default FlowChatPage;
