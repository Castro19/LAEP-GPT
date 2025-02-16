import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  flowchartActions,
  flowSelectionActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import FlowchartLog from "../flowchartLog/FlowchartLog";
import { setFlowchart, setLoading } from "@/redux/flowchart/flowchartSlice";
import { useUserData } from "@/hooks/useUserData";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import CourseSearchbar from "./courses/CourseSearchbar";
import { SidebarMenuSub } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import CourseDropdown from "./courses/CourseDropdown";
import { useEffect } from "react";
import { AnimatedModalDemo } from "@/components/layout/CustomModal";
import FlowChartOptions from "@/components/register/SignInFlow/FlowChartOptions";
import { fetchFlowchartDataHelper } from "@/redux/flowchart/api-flowchart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { environment } from "@/helpers/getEnvironmentVars";
import { FlowchartData } from "@polylink/shared/types";
import useMobile from "@/hooks/use-mobile";
import MobileHeader from "@/components/layout/MobileHeader";
export function SidebarFlowchart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { open } = useSidebar();
  const isMobile = useMobile();
  const { flowchartList } = useAppSelector((state) => state.flowchart);
  const { selections } = useAppSelector((state) => state.flowSelection);
  const { userData, handleChangeFlowchartInformation, handleSave } =
    useUserData();

  // Handler for selecting a log to view
  const handleSelectFlowchart = (flowchartId: string) => {
    dispatch(setFlowchart(flowchartId));
  };

  const handleSaveFlowchart = async () => {
    if (selections.catalog && selections.major && selections.concentration) {
      const flowchartData = await fetchFlowchartDataHelper(
        dispatch,
        selections.catalog,
        selections.major,
        selections.concentration.code,
        userData.year,
        true
      );
      await saveFlowchartToDB(flowchartData);
      dispatch(setLoading({ type: "fetchFlowchartData", value: false }));
    } else {
      toast({
        title: "Please select a catalog and major",
        description:
          "You must select a catalog and major to create a flowchart",
        variant: "destructive",
      });
    }
  };

  const saveFlowchartToDB = async (flowchartData: FlowchartData) => {
    let flowchart;
    if (!flowchartData) {
      return;
    }
    try {
      flowchart = await dispatch(
        flowchartActions.postFlowchartInDB({
          flowchartData,
          name: flowchartData.name,
          // If there are no flowcharts in the database, set the new flowchart as primary
          primaryOption: (flowchartList ?? []).length === 0,
        })
      ).unwrap(); // Unwraps the result to get the payload or throw error

      if (flowchart && flowchart.flowchartId) {
        if (flowchart.primaryOption) {
          handleChangeFlowchartInformation(
            "flowchartId",
            flowchart.flowchartId
          );
          handleSave();
        }
        navigate(`/flowchart/${flowchart.flowchartId}`);
      } else {
        if (environment === "dev") {
          console.error("Failed to get flowchartId from the response.");
        }
      }
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to save flowchart:", error);
      }
    }
  };

  useEffect(() => {
    if (selections.catalog && selections.major) {
      dispatch(
        flowSelectionActions.fetchConcentrationOptions({
          catalog: selections.catalog,
          major: selections.major,
        })
      );
    }
  }, [selections.catalog, selections.major, dispatch]);

  useEffect(() => {
    if (selections.catalog) {
      dispatch(flowSelectionActions.fetchMajorOptions(selections.catalog));
    }
  }, [selections.catalog, dispatch]);

  return (
    <Sidebar
      collapsible="icon-offcanvas"
      className={`
      flex flex-col h-full ml-16 pl-2 dark:bg-slate-900
      transition-all duration-300
      ${open ? "opacity-100" : "opacity-0 -translate-x-16"}
    `}
    >
      <SidebarHeader className="border-b border-sidebar-border dark:border-slate-700 flex-none">
        {isMobile ? (
          <MobileHeader />
        ) : (
          <div className="flex items-center justify-center mt-1">
            <span className="text-lg text-center font-semibold ml-4">
              {userData.flowchartInformation.catalog}
            </span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="border-b border-sidebar-border overflow-x-hidden">
        <ScrollArea className="h-full">
          <SidebarGroupLabel>Created Flowcharts</SidebarGroupLabel>
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <div className="flex items-center justify-between w-full text-lg">
                        Flowcharts
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="max-w-60 overflow-auto transition-max-height duration-300 ease-in-out">
                    <SidebarMenuSub className="w-full gap-y-4">
                      {flowchartList?.map((flowchart) => (
                        <FlowchartLog
                          key={flowchart.flowchartId}
                          flowchart={flowchart}
                          onSelectFlowchart={handleSelectFlowchart}
                        />
                      ))}
                    </SidebarMenuSub>
                    <div className="flex items-center justify-center">
                      <div className="w-11/12 my-4">
                        <AnimatedModalDemo
                          onSave={handleSaveFlowchart}
                          title="Create Flowchart"
                          disableOutsideClick={true}
                        >
                          <FlowChartOptions type="flowchart" />
                        </AnimatedModalDemo>
                      </div>
                    </div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
          {/* Border */}
          <div className="border-b border-sidebar-border"></div>
          {/* Classes */}
          <CourseDropdown />
          {/* Border */}
        </ScrollArea>
        <div className="border-b border-sidebar-border"></div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800">
          <CourseSearchbar />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
