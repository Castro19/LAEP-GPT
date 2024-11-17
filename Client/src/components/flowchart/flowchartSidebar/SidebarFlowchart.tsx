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
import { useAppDispatch, useAppSelector } from "@/redux";
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
import CreateFlowchartModal from "./CreateFlowchartModal";
import { SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CourseDropdown from "./courses/CourseDropdown";

export function AppSidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const flowchartList = useAppSelector(
    (state) => state.flowchart.flowchartList
  );
  const selections = useAppSelector((state) => state.flowchart.selections);
  const { handleChange, userData } = useUserData();

  // Handler for selecting a log to view
  const handleSelectFlowchart = (flowchartId: string) => {
    handleChange("flowchartId", flowchartId);
    dispatch(setFlowchart(flowchartId));
  };

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
            {selections.catalog || userData.catalog}
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
                    <CreateFlowchartModal skipHandleChange={true} />
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
