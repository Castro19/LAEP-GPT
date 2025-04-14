import { useEffect, useRef, useState } from "react";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import {
  fetchAllFlowcharts,
  setFlowchart,
  resetFlowchartData,
} from "@/redux/flowchart/flowchartSlice";
import {
  Flowchart,
  CreateFlowchart,
  FlowchartUnitCounts,
} from "@/components/flowchart";
import FlowchartLayout from "@/components/layout/FlowchartPage/FlowchartLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import OuterIconSidebar from "@/components/layout/dynamicLayouts/OuterIconSidebar";
import { useParams } from "react-router-dom";
import { environment } from "@/helpers/getEnvironmentVars";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import MobileFlowchartLayout from "@/components/layout/FlowchartPage/MobileFlowchartLayout";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarAIChatContainer } from "@/components/calendar";
import FlowchartBuilderForm from "@/components/flowchart/flowchartSidePanel/FlowchartBuilderForm";

const FlowChartPage = () => {
  const dispatch = useAppDispatch();
  const isNarrowScreen = useIsNarrowScreen();
  const { flowchartId } = useParams();

  const { flowchartData, loading, currentFlowchart, createFlowchart } =
    useAppSelector((state) => state.flowchart);

  const initialLoadRef = useRef(false);
  const previousFlowchartDataRef = useRef(flowchartData);
  const previousFlowchartIdRef = useRef(flowchartId);

  // Reset flowchart data when flowchartId changes
  useEffect(() => {
    if (previousFlowchartIdRef.current !== flowchartId && createFlowchart) {
      // Reset the flowchart data to clear completed courses
      dispatch(resetFlowchartData());
      previousFlowchartIdRef.current = flowchartId;
    }
  }, [flowchartId, dispatch, createFlowchart]);

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
      {isNarrowScreen ? (
        <FlowchartMobile />
      ) : (
        <div className="flex overflow-hidden no-scroll">
          <OuterIconSidebar />
          <SidebarProvider className="dark:bg-slate-900">
            <FlowchartLayout>
              <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4">
                <div className="col-span-1">
                  <Tabs defaultValue="Build Schedule">
                    <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
                      <TabsTrigger value="Build Schedule">
                        Flowchart
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="Build Schedule">
                      <FlowchartBuilderForm />
                    </TabsContent>
                    <TabsContent value="AI Chat">
                      <CalendarAIChatContainer />
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="col-span-3 items-start justify-start">
                  {createFlowchart || !flowchartData ? (
                    <CreateFlowchart />
                  ) : (
                    <>
                      <Flowchart flowchartData={flowchartData} />
                      {flowchartData && <FlowchartUnitCounts />}
                    </>
                  )}
                </div>
              </div>
            </FlowchartLayout>
          </SidebarProvider>
        </div>
      )}
    </>
  );
};

const FlowchartMobile = () => {
  const { flowchartData, createFlowchart } = useAppSelector(
    (state) => state.flowchart
  );
  const [selectedTab, setSelectedTab] = useState("Flowchart");

  // Function to handle tab switching
  const handleTabSwitch = () => {
    setSelectedTab("Flowchart");
  };

  return (
    <div className="flex overflow-hidden no-scroll">
      <SidebarProvider className="dark:bg-slate-900">
        <MobileFlowchartLayout>
          <Tabs
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value)}
          >
            <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900 h-8">
              <TabsTrigger value="Flowchart Builder">
                Flowchart Builder
              </TabsTrigger>
              <TabsTrigger value="Flowchart">Flowchart</TabsTrigger>
            </TabsList>
            <TabsContent value="Flowchart Builder">
              <FlowchartBuilderForm onSwitchTab={handleTabSwitch} />
            </TabsContent>
            <TabsContent value="Flowchart">
              {createFlowchart || !flowchartData ? (
                <CreateFlowchart onSwitchTab={handleTabSwitch} />
              ) : (
                <Flowchart flowchartData={flowchartData} />
              )}
            </TabsContent>
          </Tabs>
        </MobileFlowchartLayout>
      </SidebarProvider>
    </div>
  );
};

export default FlowChartPage;
