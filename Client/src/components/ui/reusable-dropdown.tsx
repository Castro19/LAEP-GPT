import { Label } from "./label";
import { Select } from "./select";
import { SelectContent } from "./select";
import { SelectItem } from "./select";
import { SelectTrigger } from "./select";
import { SelectValue } from "./select";

interface ReusableDropdownProps {
  name: string;
  dropdownItems: string[];
  // eslint-disable-next-line no-unused-vars
  handleChangeItem: (key: string, value: string) => void;
  selectedItem: string;
  position?: "item-aligned" | "popper";
  dropdownRef: React.RefObject<HTMLDivElement> | null;
}

interface ReusableDropdownProps {
  name: string;
  dropdownItems: string[];
  // eslint-disable-next-line no-unused-vars
  handleChangeItem: (name: string, value: string) => void;
  selectedItem: string;
  position?: "item-aligned" | "popper";
  dropdownRef: React.RefObject<HTMLDivElement> | null;
  placeholder?: string; // New optional prop
  className?: string; // New optional prop
}

const ReusableDropdown = ({
  name,
  dropdownItems,
  handleChangeItem,
  selectedItem,
  position = "popper",
  dropdownRef,
  placeholder = "Select an option", // Default value
  className = "", // Default value
}: ReusableDropdownProps) => {
  return (
    <LabelInputContainer>
      <Label className="underline">{name}</Label>
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
          ref={dropdownRef}
        >
          {dropdownItems.map((value: string, index: number) => (
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
};

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col justify-center items-center space-y-2 mb-4">
    {children}
  </div>
);

export default ReusableDropdown;