import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux";
import { AssistantType } from "@polylink/shared/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import React from "react";
import { cn } from "@/lib/utils";
import { useToast } from "../../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

type SideBarModeDropDownProps = {
  // eslint-disable-next-line no-unused-vars
  onSelect: (model: AssistantType) => void;
};

export default function SideBarModeDropDown({ onSelect }: SideBarModeDropDownProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentModel, assistantList } = useAppSelector(
    (state) => state.assistant
  );
  const { userData } = useAppSelector((state) => state.user);
  const [matchingAssistantLocked, setMatchingAssistantLocked] = useState(true);
  const [flowchartAssistantLocked, setFlowchartAssistantLocked] =
    useState(true);
  const [toastMatchingDescription, setToastMatchingDescription] = useState("");
  const [toastFlowchartDescription, setToastFlowchartDescription] =
    useState("");

  useEffect(() => {
    const { availability, interestAreas } = userData;

    const userHasNoAvailability = Object.values(availability).every(
      (timeSlots) => timeSlots.length === 0
    );
    const userHasNoPrimaryFlowchart =
      !userData.flowchartInformation.flowchartId;

    const matchingAssistantLocked =
      interestAreas.length === 0 || userHasNoAvailability;

    if (interestAreas.length === 0 && !userHasNoAvailability) {
      setToastMatchingDescription("Please update your profile's interestAreas");
    } else if (userHasNoAvailability && interestAreas.length > 0) {
      setToastMatchingDescription("Please update your profile's availability");
    } else {
      setToastMatchingDescription(
        "Please update your profile's interestAreas and availability"
      );
    }
    if (userHasNoPrimaryFlowchart) {
      setToastFlowchartDescription("Please create a primary flowchart");
    }
    setFlowchartAssistantLocked(userHasNoPrimaryFlowchart);
    setMatchingAssistantLocked(matchingAssistantLocked);
  }, [userData]);
  // Transform assistantList to prioritize 'name' over 'title'
  const transformedassistantList = assistantList.map((option) => {
    // Prioritize displaying 'name', fallback to 'title' if 'name' is not available
    const title = option.title || "Unnamed Assistant";
    const description = option.desc || "No description available";

    return {
      id: option.id,
      title,
      desc: description,
      urlPhoto: option.urlPhoto || "", // Default to an empty string if no photo is provided
      locked:
        (title === "Matching Assistant" && matchingAssistantLocked) ||
        (title === "Flowchart Assistant" && flowchartAssistantLocked),
    };
  });

  const handleLockClick = (gpt: AssistantType) => {
    const handleToastAction = () => {
      if (gpt.title === "Matching Assistant") {
        navigate(`/profile/edit`);
      } else if (gpt.title === "Flowchart Assistant") {
        navigate(`/flowchart`);
      }
    };
    toast({
      title: `${gpt.title} is locked`,
      description:
        gpt.title === "Matching Assistant"
          ? toastMatchingDescription
          : toastFlowchartDescription,
      action: (
        <ToastAction altText="Update Profile" onClick={handleToastAction}>
          {gpt.title === "Matching Assistant"
            ? "Update Profile"
            : "Create Flowchart"}
        </ToastAction>
      ),
    });
  };

  const handleAssistantSelect = (option: ListItemAssistant) => {
    if (option.locked) {
      handleLockClick(option);
    } else {
      onSelect(option);
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="w-full">
        <NavigationMenuItem className="w-full p-1">
          <NavigationMenuTrigger className="w-full group flex items-center justify-between px-9 py-1 ml-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-opacity-70">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={currentModel.urlPhoto || "/imgs/test.png"}
                  alt={currentModel.title}
                />
              </Avatar>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{currentModel.title}</span>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-full md:bg-gray-800">
            <ul className="p-2 w-full bg-popover">
              {transformedassistantList.map((option) => (
                <ListItem
                  key={option.id}
                  assistant={option}
                  onClick={() => handleAssistantSelect(option)}
                  className={cn(
                    "w-full group",
                    option.locked ? "cursor-not-allowed opacity-50" : ""
                  )}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

type ListItemAssistant = AssistantType & {
  locked: boolean;
};

const ListItem = React.forwardRef<
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
        "hover:bg-slate-700 hover:text-white",
        "whitespace-nowrap min-w-0",
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
ListItem.displayName = "ListItem";
