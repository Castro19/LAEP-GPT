import { useEffect, useRef } from "react";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import {
  fetchAllFlowcharts,
  setFlowchart,
} from "@/redux/flowchart/flowchartSlice";
import { Flowchart, EmptyFlowchart } from "@/components/flowchart";
import FlowchartLayout from "@/components/layout/FlowchartPage/FlowchartLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import OuterIconSidebar from "@/components/layout/dynamicLayouts/OuterIconSidebar";
import { useParams } from "react-router-dom";
import { environment } from "@/helpers/getEnvironmentVars";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const FlowChartPage = () => {
  const dispatch = useAppDispatch();
  const isNarrowScreen = useIsNarrowScreen();
  const { flowchartId } = useParams();
  const { flowchartData, loading, currentFlowchart } = useAppSelector(
    (state) => state.flowchart
  );

  const initialLoadRef = useRef(false);
  const previousFlowchartDataRef = useRef(flowchartData);

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

  useEffect(() => {
    const updateFlowchart = async () => {
      if (
        initialLoadRef.current &&
        JSON.stringify(previousFlowchartDataRef.current) ===
          JSON.stringify(flowchartData)
      ) {
        return;
      }

      previousFlowchartDataRef.current = flowchartData;

      try {
        if (
          flowchartId &&
          !loading.fetchFlowchartData &&
          !loading.updateFlowchart &&
          !loading.deleteFlowchart &&
          !loading.setFlowchart &&
          currentFlowchart
        ) {
          await dispatch(
            flowchartActions.updateFlowchart({
              flowchartId: flowchartId ?? "",
              flowchartData,
              name: currentFlowchart?.name ?? "",
              primaryOption: currentFlowchart?.primaryOption ?? false,
            })
          ).unwrap();
        }
      } catch (error) {
        if (environment === "dev") {
          console.error("Failed to update flowchart:", error);
        }
      }
    };

    updateFlowchart();
    initialLoadRef.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowchartData]);

  return (
    <>
      <div className="flex overflow-hidden no-scroll">
        {isNarrowScreen ? null : <OuterIconSidebar />}
        <SidebarProvider className="dark:bg-slate-900">
          <FlowchartLayout>
            {flowchartData ? (
              <Flowchart flowchartData={flowchartData} />
            ) : (
              <EmptyFlowchart />
            )}
          </FlowchartLayout>
        </SidebarProvider>
      </div>
    </>
  );
};

export default FlowChartPage;
