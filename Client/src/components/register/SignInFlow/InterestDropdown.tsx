import { useEffect, useState } from "react";

// Redux
import { useAppSelector } from "@/redux";

// Hooks
import { useUserData } from "@/hooks/useUserData";

// Types
import { UserData } from "@polylink/shared/types";

// UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const InterestDropdown = ({
  name,
  items,
  dropdownRef,
}: {
  name: string;
  items: string[];
  dropdownRef?: React.RefObject<HTMLDivElement>;
}): JSX.Element => {
  const [position, setPosition] = useState<"item-aligned" | "popper">("popper");
  const userData = useAppSelector((state) => state.user.userData);
  const { handleAddItem, handleRemoveItem } = useUserData();
  let dropdownItems: string[] = [];
  let selectedItems: string[] = [];
  if (name === "Interests") {
    selectedItems = userData.interestAreas;
    dropdownItems = items.filter((item) => !selectedItems.includes(item));
    // Sort dropdown items by alphabetical order
    dropdownItems.sort();
  }
  useEffect(() => {
    const adjustDropdownPosition = () => {
      const selectElem = document.getElementById(name);
      if (selectElem) {
        const rect = selectElem.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const bottomSpace = viewportHeight - rect.bottom;
        if (bottomSpace < 200) {
          setPosition("item-aligned");
        } else {
          setPosition("popper");
        }
      }
    };

    window.addEventListener("resize", adjustDropdownPosition);
    adjustDropdownPosition();

    return () => {
      window.removeEventListener("resize", adjustDropdownPosition);
    };
  }, [name]);

  return (
    <>
      <LabelInputContainer>
        <Label className="underline">{name}</Label>
        <Select
          onValueChange={(value) =>
            handleAddItem(name.toLowerCase() as keyof UserData, value)
          }
          value={""} // Controlled component
        >
          <SelectTrigger id={name} className="text-black dark:text-black">
            <SelectValue
              placeholder={
                name === "Interests" ? "Select an Interest" : "Select a Course"
              }
            />
          </SelectTrigger>
          <SelectContent
            position={position}
            data-testid={`home-dropdown-${name}-list`}
            ref={dropdownRef}
          >
            {dropdownItems.map((value: string, index: number) => (
              <SelectItem
                key={index}
                value={value}
                onClick={() =>
                  handleAddItem(name.toLowerCase() as keyof UserData, value)
                }
                data-testid={`home-dropdown-${name}-item-${index}`}
                className="whitespace-normal break-words"
              >
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </LabelInputContainer>
      <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap" }}>
        {selectedItems.map((item: string, index: number) => (
          <Button
            key={index}
            onClick={() =>
              handleRemoveItem(name.toLowerCase() as keyof UserData, item)
            }
            style={{ margin: "5px" }}
            className="whitespace-normal h-auto py-2"
          >
            {item} ✕
          </Button>
        ))}
      </div>
    </>
  );
};

export default InterestDropdown;

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 mb-4">{children}</div>
);
