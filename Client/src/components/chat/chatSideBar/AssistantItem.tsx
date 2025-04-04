import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AssistantType } from "@polylink/shared/types";

export type ListItemAssistant = AssistantType & {
  locked: boolean;
};

const AssistantItem = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & {
    assistant: ListItemAssistant;
  }
>(({ className, assistant, ...props }, ref) => {
  const { title, urlPhoto } = assistant;
  
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center space-x-3 w-full px-2 py-2 text-left",
        "rounded-md transition-colors",
        "hover:bg-slate-700 hover:text-white", // Ensure hover effect is defined
        "whitespace-nowrap min-w-0",
        "text-white", // Default text color
        className
      )}
      {...props}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage
          src={urlPhoto || "/imgs/test.png"}
          alt="Assistant Photo"
        />
      </Avatar>
      <span className="text-sm font-medium truncate">
        {title}
      </span>
    </button>
  );
});

AssistantItem.displayName = "AssistantItem";

export default AssistantItem; 