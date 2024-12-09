import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux";
// UI

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
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

type ModeDropDownProps = {
  // eslint-disable-next-line no-unused-vars
  onSelect: (model: AssistantType) => void;
};

export default function ModeDropDown({ onSelect }: ModeDropDownProps) {
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
    const { availability, interests } = userData;

    const userHasNoAvailability = Object.values(availability).every(
      (timeSlots) => timeSlots.length === 0
    );
    const userHasNoPrimaryFlowchart = !userData.flowchartId;

    const matchingAssistantLocked =
      interests.length === 0 || userHasNoAvailability;

    if (interests.length === 0 && !userHasNoAvailability) {
      setToastMatchingDescription("Please update your profile's interests");
    } else if (userHasNoAvailability && interests.length > 0) {
      setToastMatchingDescription("Please update your profile's availability");
    } else {
      setToastMatchingDescription(
        "Please update your profile's interests and availability"
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

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{currentModel.title}</NavigationMenuTrigger>
          <NavigationMenuContent className="w-[80vw]">
            <ul className="grid p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] lg:auto-rows-min bg-white dark:bg-gray-900">
              <li className="row-span-1 mb-3 mr-3 border-b pb-3 lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
                <div className="text-lg font-medium">{currentModel.title}</div>
                <p className="text-sm leading-tight text-muted-foreground">
                  {currentModel.desc}
                </p>
              </li>
              <div className="grid gap-2">
                {transformedassistantList.map((option) => (
                  <ListItem
                    key={option.id}
                    assistant={option}
                    onClick={() =>
                      option.locked ? handleLockClick(option) : onSelect(option)
                    }
                    className={option.locked ? "cursor-not-allowed" : ""}
                  />
                ))}
              </div>
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
        "block w-full select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:dark:bg-slate-800 hover:text-white focus:dark:bg-slate-800 focus:text-white",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-4 my-1">
        <Avatar className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110">
          <AvatarImage
            src={urlPhoto || "/imgs/test.png"}
            alt="Assistant Photo"
          />
        </Avatar>
        <div className="text-sm font-medium leading-none">{title}</div>
      </div>
    </button>
  );
});
ListItem.displayName = "ListItem";
