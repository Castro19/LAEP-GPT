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
import CourseSearchbar from "./courses/CourseSearchbar";
import classesExample from "../exampleData/classesExample.json";
import { Course } from "@/types";
import SidebarCourse from "./courses/SidebarCourse";
import { Draggable, Droppable } from "@hello-pangea/dnd";

const classes = classesExample as Record<string, Course[]>;

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
                    <Droppable
                      droppableId={`sidebar-${key}`}
                      isDropDisabled={true}
                    >
                      {(provided) => (
                        <SidebarMenu
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {value.map((item: Course, index) => (
                            <Draggable
                              key={
                                item.id
                                  ? `sidebar-${item.id}`
                                  : `sidebar-course-${index}`
                              }
                              draggableId={
                                item.id
                                  ? `sidebar-${item.id}`
                                  : `sidebar-course-${index}`
                              }
                              index={index}
                            >
                              {(provided) => (
                                <SidebarMenuItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <SidebarCourse course={item} />
                                </SidebarMenuItem>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </SidebarMenu>
                      )}
                    </Droppable>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        ))}
        <CourseSearchbar />
      </SidebarContent>
    </Sidebar>
  );
}
