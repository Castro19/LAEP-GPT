import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import FlowchartLog from "../flowchartLog/FlowchartLog";
import { setFlowchart } from "@/redux/flowchart/flowchartSlice";
import { useUserData } from "@/hooks/useUserData";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronLeft } from "lucide-react";
import CourseSearchbar from "./courses/CourseSearchbar";
import { SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CourseDropdown from "./courses/CourseDropdown";
import { useEffect } from "react";
import { AnimatedModalDemo } from "@/components/layout/CustomModal";
import FlowChartOptions from "@/components/register/SignInFlow/FlowChartOptions";
import { fetchFlowchartDataHelper } from "@/redux/flowchart/api-flowchart";
import { toast } from "@/components/ui/use-toast";

export function AppSidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const flowchartList = useAppSelector(
    (state) => state.flowchart.flowchartList
  );
  const { selections } = useAppSelector((state) => state.flowchart);
  const { handleChange, userData } = useUserData();

  // Handler for selecting a log to view
  const handleSelectFlowchart = (flowchartId: string) => {
    handleChange("flowchartId", flowchartId);
    dispatch(setFlowchart(flowchartId));
  };

  const handleSaveFlowchart = () => {
    if (userData.catalog && userData.major && selections.concentration) {
      fetchFlowchartDataHelper(
        dispatch,
        userData.catalog,
        userData.major,
        selections.concentration.code
      );
      navigate("/flowchart");
    }
  };

  useEffect(() => {
    if (userData.catalog && userData.major) {
      dispatch(
        flowchartActions.fetchConcentrationOptions({
          catalog: userData.catalog,
          major: userData.major,
        })
      );
    } else {
      toast({
        title: "Please select a catalog and major",
        description:
          "You must select a catalog and major to create a flowchart",
        variant: "destructive",
      });
    }
  }, [userData.catalog, userData.major, dispatch]);

  return (
    <Sidebar variant="sidebar" className="flex flex-col h-full">
      <SidebarHeader className="border-b border-sidebar-border flex-none">
        <div className="flex items-center justify-start gap-4">
          {/* Back button */}
          <Button
            className="justify-start"
            variant="ghost"
            size="icon"
            onClick={() => {
              navigate("/profile/edit");
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg text-center font-semibold ml-4">
            {userData.catalog}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="border-b border-sidebar-border flex-1 overflow-x-hidden">
        <SidebarGroupLabel>Created Flowcharts</SidebarGroupLabel>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <div className="flex items-center justify-between w-full text-lg">
                      Flowcharts
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="w-full gap-y-4">
                    {flowchartList?.map((flowchart) => (
                      <SidebarMenuSubItem key={flowchart.flowchartId}>
                        <FlowchartLog
                          flowchart={flowchart}
                          onSelectFlowchart={handleSelectFlowchart}
                        />
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                  <div className="w-full my-4">
                    <AnimatedModalDemo
                      onSave={handleSaveFlowchart}
                      title="Create Flowchart"
                      disableOutsideClick={true}
                    >
                      <FlowChartOptions type="flowchart" />
                    </AnimatedModalDemo>
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
        <div className="border-b border-sidebar-border"></div>
        <div className="sticky bottom-0 bg-white dark:bg-gray-800">
          <CourseSearchbar />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
