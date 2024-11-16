// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
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
import { ChevronDown } from "lucide-react";
import SidebarCourses from "./courses/SidebarCourses";

// Menu items.
const items = [
  {
    title: "Flowcharts",
    // icon: Home,
  },
  {
    title: "Classes",
    // icon: Inbox,
  },
];

const classes = {
  Required: [
    { title: "MATH1", primary: true },
    { title: "MATH2", primary: true },
    { title: "MATH3", primary: true },
    { title: "MATH4", primary: true },
    { title: "MATH5", primary: true },
    { title: "MATH6", primary: true },
  ],
  Elective: [
    { title: "MATH7", primary: false },
    { title: "MATH8", primary: false },
    { title: "MATH9", primary: false },
    { title: "MATH10", primary: false },
  ],
  GE: [
    { title: "GE1", primary: false },
    { title: "GE2", primary: false },
    { title: "GE3", primary: false },
    { title: "GE4", primary: false },
    { title: "GE5", primary: false },
    { title: "GE6", primary: false },
  ],
  GWR: [
    { title: "GWR1", primary: false },
    { title: "GWR2", primary: false },
    { title: "GWR3", primary: false },
    { title: "GWR4", primary: false },
    { title: "GWR5", primary: false },
    { title: "GWR6", primary: false },
  ],
  USCP: [
    { title: "USCP1", primary: false },
    { title: "USCP2", primary: false },
    { title: "USCP3", primary: false },
    { title: "USCP4", primary: false },
    { title: "USCP5", primary: false },
    { title: "USCP6", primary: false },
  ],
};

export function AppSidebar() {
  const dispatch = useAppDispatch();

  const flowchartList = useAppSelector(
    (state) => state.flowchart.flowchartList
  );
  const { handleChange } = useUserData();

  // Handler for selecting a log to view
  const handleSelectFlowchart = (flowchartId: string) => {
    handleChange("flowchartId", flowchartId);
    dispatch(setFlowchart(flowchartId));
  };

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader />
      <SidebarContent>
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
                  <SidebarMenu>
                    {flowchartList?.map((flowchart) => (
                      <SidebarMenuItem key={flowchart.flowchartId}>
                        <FlowchartLog
                          flowchart={flowchart}
                          onSelectFlowchart={handleSelectFlowchart}
                        />
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
        {/* Classes */}
        {Object.entries(classes).map(([key, value]) => (
          <SidebarGroup key={key}>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full">
                      <div className="flex items-center justify-between w-full text-lg">
                        {key}
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu>
                      {value.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <span>{item.title}</span>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        ))}
        <SidebarCourses />
      </SidebarContent>
    </Sidebar>
  );
}
