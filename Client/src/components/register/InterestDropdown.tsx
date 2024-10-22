import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserData } from "@/hooks/useUserData";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const underlineStyle = "underline";

const csInterests = [
  "Artificial Intelligence",
  "Cybersecurity",
  "Data Science",
  "Software Engineering",
  "Web Development",
  "Mobile Development",
  "Game Development",
  "Machine Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Virtual Reality",
  "Robotics",
  "Blockchain",
  "Quantum Computing",
  "Augmented Reality",
  "3D Printing",
];

const name = "interests";

const InterestDropdown = (): JSX.Element => {
  const [position, setPosition] = useState<"item-aligned" | "popper">("popper");
  const { userData, handleAddInterest, handleRemoveInterest } = useUserData();
  console.log("USER DATA", userData);
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
  }, []);

  return (
    <>
      <LabelInputContainer>
        <Label className={underlineStyle}>Interests</Label>
        <Select
          onValueChange={(value) => handleAddInterest(value)}
          value={""} // Controlled component
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
            {csInterests.map((value: string, index: number) => (
              <SelectItem
                key={index}
                value={value}
                onClick={() => handleAddInterest(value)}
                data-testid={`home-dropdown-${name}-item-${index}`}
              >
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </LabelInputContainer>
      <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap" }}>
        {userData?.interests?.map((interest: string, index: number) => (
          <Button
            key={index}
            onClick={() => handleRemoveInterest(interest)}
            style={{ margin: "5px" }}
          >
            {interest} ✕
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
