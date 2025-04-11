import { useEffect, useRef } from "react";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import {
  fetchAllFlowcharts,
  setFlowchart,
} from "@/redux/flowchart/flowchartSlice";
import { Flowchart, CreateFlowchart } from "@/components/flowchart";
import FlowchartLayout from "@/components/layout/FlowchartPage/FlowchartLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import OuterIconSidebar from "@/components/layout/dynamicLayouts/OuterIconSidebar";
import { useParams } from "react-router-dom";
import { environment } from "@/helpers/getEnvironmentVars";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import MobileFlowchartLayout from "@/components/layout/FlowchartPage/MobileFlowchartLayout";
import useDeviceType from "@/hooks/useDeviceType";

const FlowChartPage = () => {
  const dispatch = useAppDispatch();
  const isNarrowScreen = useIsNarrowScreen();
  const { flowchartId } = useParams();
  const device = useDeviceType();

  const { flowchartData, loading, currentFlowchart, createFlowchart } =
    useAppSelector((state) => state.flowchart);

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
      {device !== "desktop" ? (
        <div className="flex overflow-hidden no-scroll">
          <SidebarProvider className="dark:bg-slate-900">
            <MobileFlowchartLayout>
              {createFlowchart || !flowchartData ? (
                <CreateFlowchart />
              ) : (
                <Flowchart flowchartData={flowchartData} />
              )}
            </MobileFlowchartLayout>
          </SidebarProvider>
        </div>
      ) : (
        <div className="flex overflow-hidden no-scroll">
          {isNarrowScreen ? null : <OuterIconSidebar />}
          <SidebarProvider className="dark:bg-slate-900">
            <FlowchartLayout>
              {createFlowchart || !flowchartData ? (
                <CreateFlowchart />
              ) : (
                <Flowchart flowchartData={flowchartData} />
              )}
            </FlowchartLayout>
          </SidebarProvider>
        </div>
      )}
    </>
  );
};

export default FlowChartPage;
