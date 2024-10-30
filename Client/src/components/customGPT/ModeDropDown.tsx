import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { layoutActions, useAppDispatch, useAppSelector } from "@/redux";
// UI

import { GptType, MyUserInfo } from "@/types";
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

type ModeDropDownProps = {
  // eslint-disable-next-line no-unused-vars
  onSelect: (model: GptType) => void;
};

export default function ModeDropDown({ onSelect }: ModeDropDownProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const { currentModel, gptList } = useAppSelector((state) => state.gpt);
  const isDropdownVisible = useAppSelector(
    (state) => state.layout.isDropdownVisible
  );
  const { userData } = useAppSelector((state) => state.user);
  const [matchingAssistantLocked, setMatchingAssistantLocked] = useState(true);

  useEffect(() => {
    const userMatchingAssistantLocked = (userData: MyUserInfo) => {
      const { availability, interests } = userData;

      const hasNoAvailability = Object.values(availability).every(
        (timeSlots) => timeSlots.length === 0
      );
      return interests.length === 0 || hasNoAvailability;
    };
    const matchingAssistantLocked = userMatchingAssistantLocked(userData);
    setMatchingAssistantLocked(matchingAssistantLocked);
  }, [userData]);
  // Transform gptList to prioritize 'name' over 'title'
  const transformedGptList = gptList.map((option) => {
    // Prioritize displaying 'name', fallback to 'title' if 'name' is not available
    const title = option.title || "Unnamed Assistant";
    const description = option.desc || "No description available";
    if (matchingAssistantLocked && option.title === "matchingAssistant") {
      console.log("matchingAssistantLocked", matchingAssistantLocked);
    }
    return {
      id: option.id,
      title,
      desc: description,
      urlPhoto: option.urlPhoto || "", // Default to an empty string if no photo is provided
      locked: title === "Matching Assistant" && matchingAssistantLocked,
    };
  });

  const onViewGPTs = () => {
    navigate(`/user/${userId}/gpts`);
    dispatch(layoutActions.toggleDropdown(false));
    console.log("Is Dropdown Visible: ", isDropdownVisible);
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{currentModel.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-white dark:bg-gray-900">
              <li className="row-span-3 mb-3 mr-3 border-b pb-3 lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
                <div className="text-lg font-medium">{currentModel.title}</div>
                <p className="text-sm leading-tight text-muted-foreground">
                  {currentModel.desc}
                </p>
              </li>
              {transformedGptList.map((option) => (
                <ListItem
                  key={option.id}
                  gpt={option}
                  disabled={option.locked}
                  onClick={() => onSelect(option)}
                  className={option.locked ? "cursor-not-allowed" : ""}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & { gpt: GptType }
>(({ className, gpt, disabled, children, ...props }, ref) => {
  const { id, title, urlPhoto } = gpt;
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "block w-full select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <Avatar className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110">
          <AvatarImage
            src={urlPhoto || "/imgs/test.png"}
            alt="Assistant Photo"
          />
        </Avatar>
        <div>
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </div>
      </div>
    </button>
  );
});
ListItem.displayName = "ListItem";
