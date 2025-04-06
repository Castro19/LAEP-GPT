import { useEffect } from "react";
import {
  flowchartActions,
  flowSelectionActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";

// My components
import {
  FlowchartLog,
  CourseDropdown,
  CourseSearchbar,
} from "@/components/flowchart";

import MobileHeader from "@/components/layout/dynamicLayouts/MobileHeader";

// Hooks
import { useUserData } from "@/hooks/useUserData";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

// UI Components
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarMenuSub } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SidebarFlowchart() {
  const dispatch = useAppDispatch();
  const { flowchartList } = useAppSelector((state) => state.flowchart);
  const { selections } = useAppSelector((state) => state.flowSelection);

  const navigate = useNavigate();

  const isNarrowScreen = useIsNarrowScreen();
  const { open } = useSidebar();
  const { userData } = useUserData();

  // Handler for selecting a log to view
  const handleSelectFlowchart = (flowchartId: string) => {
    dispatch(flowchartActions.setFlowchart(flowchartId));
    dispatch(flowchartActions.setCreateFlowchart(false));
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

  const handleCreateFlowchart = () => {
    dispatch(flowchartActions.setCreateFlowchart(true));
    dispatch(flowchartActions.setFlowchartData(null));
    navigate("/flowchart");
  };

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
        {isNarrowScreen ? (
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
                      <Button
                        type="submit"
                        className="w-11/12 shadow-lg dark:bg-gray-100 dark:bg-opacity-90 dark:hover:bg-gray-300 dark:hover:bg-opacity-90"
                        onClick={handleCreateFlowchart}
                      >
                        Create Flowchart
                      </Button>
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
