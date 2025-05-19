import { Select } from "./select";
import { SelectContent } from "./select";
import { SelectItem } from "./select";
import { SelectTrigger } from "./select";
import { SelectValue } from "./select";
import React from "react";

interface ReusableDropdownProps {
  name: string;
  dropdownItems: string[];
  valueLabelDropdown?: {
    value: string;
    label: string;
  }[];
  // eslint-disable-next-line no-unused-vars
  handleChangeItem: (name: string, value: string) => void;
  selectedItem: string;
  position?: "item-aligned" | "popper";
  placeholder?: string; // New optional prop
  className?: string; // New optional prop
}

const ReusableDropdown = React.forwardRef<
  HTMLDivElement,
  ReusableDropdownProps
>(
  (
    {
      name,
      dropdownItems,
      handleChangeItem,
      valueLabelDropdown,
      selectedItem,
      position = "popper",
      placeholder = "Select an option", // Default value
      className = "", // Default value
    },
    ref
  ) => {
    return (
      <LabelInputContainer ref={ref}>
        <Select
          onValueChange={(value) => handleChangeItem(name, value)}
          value={selectedItem}
        >
          <SelectTrigger
            id={name}
            className={`text-black dark:text-black ${className}`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            position={position}
            data-testid={`dropdown-${name.toLowerCase()}-list`}
            className="w-min"
          >
            {valueLabelDropdown
              ? valueLabelDropdown.map((valueLabel) => (
                  <SelectItem
                    key={valueLabel.value}
                    value={valueLabel.value}
                    data-testid={`dropdown-${name.toLowerCase()}-item-${valueLabel.value}`}
                  >
                    {valueLabel.label}
                  </SelectItem>
                ))
              : dropdownItems.map((value: string, index: number) => (
                  <SelectItem
                    key={`${value}-${index}`}
                    value={value}
                    data-testid={`dropdown-${name.toLowerCase()}-item-${index}`}
                    className="whitespace-normal break-words"
                  >
                    {value}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </LabelInputContainer>
    );
  }
);

const LabelInputContainer = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => (
  <div
    ref={ref}
    className="flex flex-col justify-center items-center space-y-2 mb-4 w-full"
  >
    {children}
  </div>
));

ReusableDropdown.displayName = "ReusableDropdown";
LabelInputContainer.displayName = "LabelInputContainer";

export default ReusableDropdown;
