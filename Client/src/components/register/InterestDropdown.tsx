import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InterestDropdownProps = {
  name: string;
  labelText: string;
  handleFunction: (value: string) => void;
  listOfItems: string[];
  selectedValue: string;
};

const InterestDropdown = ({
  name,
  handleFunction,
  listOfItems,
  selectedValue,
}: InterestDropdownProps): JSX.Element => {
  const [position, setPosition] = useState<"item-aligned" | "popper">("popper");

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
      <Select
        onValueChange={(value) => handleFunction(value)}
        value={selectedValue} // Controlled component
      >
        <SelectTrigger id={name}>
          <SelectValue
            placeholder="Select an Interest"
            style={{ color: "black" }}
          />
        </SelectTrigger>
        <SelectContent
          position={position}
          data-testid={`home-dropdown-${name}-list`}
        >
          {listOfItems.map((value: string, index: number) => (
            <SelectItem
              key={index}
              value={value}
              onClick={() => handleFunction(value)}
              data-testid={`home-dropdown-${name}-item-${index}`}
            >
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default InterestDropdown;
