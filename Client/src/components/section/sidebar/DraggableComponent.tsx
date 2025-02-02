import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Draggable } from "@hello-pangea/dnd";
import React from "react";

type DraggableComponentProps = {
  item: {
    title: string;
    icon: React.ElementType;
    url: string;
  };
  index: number;
};
const DraggableComponent = ({ item, index }: DraggableComponentProps) => {
  return (
    <Draggable draggableId={item.title} index={index} key={item.title}>
      {(provided) => (
        <SidebarMenuItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <SidebarMenuButton asChild>
            <div className="flex items-center gap-8">
              <item.icon />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{item.title}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </Draggable>
  );
};

export default DraggableComponent;
