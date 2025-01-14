import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/useUserData";
import { UserData } from "@polylink/shared/types";
import { useState } from "react";
import { ITEMS } from "@/calpolyData/items";

type CheckboxSurveyProps = {
  label: string;
  // eslint-disable-next-line no-unused-vars
  handleChange: (value: string[]) => void;
};

const chooseSelectedItems = (label: string, userData: UserData) => {
  if (label === "What areas do you find interesting?") {
    return userData.interestAreas;
  } else if (label === "What activities do you like to do?") {
    return userData.preferredActivities;
  } else if (label === "Goals for your college experience") {
    return userData.goals;
  }
  return [];
};
export function CheckboxSurvey({ label, handleChange }: CheckboxSurveyProps) {
  const { userData } = useUserData();
  const [selectedItems, setSelectedItems] = useState<string[]>(
    chooseSelectedItems(label, userData)
  );
  const [showTextAreaItem, setShowTextAreaItem] = useState(
    selectedItems.includes("Other")
  );
  const [otherItem, setOtherItem] = useState(
    selectedItems.filter((item) => {
      const selectedLabels = ITEMS[label].map((item) => item.label);
      return !selectedLabels.includes(item);
    })[0]
  );

  const handleItemChange = (checked: boolean, value: string) => {
    if (checked) {
      // Option is checked
      if (value === "Other") {
        setShowTextAreaItem(true);
        if (otherItem) {
          setSelectedItems([...selectedItems, otherItem]);
        }
      }
      setSelectedItems([...selectedItems, value]);
      handleChange([...selectedItems, value]);
    } else {
      // Option is unchecked
      let newItems: string[] = [];
      if (value === "Other") {
        setShowTextAreaItem(false);
        setOtherItem("");
        newItems = selectedItems.filter(
          (interest) => interest !== otherItem && interest !== "Other"
        );
      } else {
        newItems = selectedItems.filter((interest) => interest !== value);
      }
      setSelectedItems(newItems);
      handleChange(newItems);
    }
  };

  const handleOtherItemChange = (value: string) => {
    setOtherItem(value);
    const newItems = selectedItems
      .filter((interest) => interest !== otherItem)
      .concat(value);
    setSelectedItems(newItems);
    handleChange(newItems);
  };

  const isChecked = (item: string) => {
    if (label === "What areas do you find interesting?") {
      console.log(userData.interestAreas);
      return userData.interestAreas.includes(item);
    } else if (label === "What activities do you like to do?") {
      return userData.preferredActivities.includes(item);
    } else if (label === "Goals for your college experience") {
      return userData.goals.includes(item);
    }
    return false;
  };
  return (
    <div>
      <LabelInputContainer>
        <Label className="text-lg align-start mb-4">{label}</Label>
        {ITEMS[label].map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            {item.id === "other" ? (
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={isChecked(item.label)}
                    onCheckedChange={(checked) =>
                      handleItemChange(checked as boolean, item.label)
                    }
                  />
                  <Label htmlFor={item.id}>{item.label}</Label>
                </div>
                {showTextAreaItem && (
                  <Textarea
                    className="w-full animate-in fade-in-0 slide-in-from-top-10 duration-300"
                    placeholder="Please specify"
                    id="message"
                    maxLength={25}
                    value={otherItem}
                    onChange={(e) => handleOtherItemChange(e.target.value)}
                  />
                )}
              </div>
            ) : (
              <>
                <Checkbox
                  id={item.id}
                  checked={isChecked(item.label)}
                  onCheckedChange={(checked) =>
                    handleItemChange(checked as boolean, item.label)
                  }
                />
                <Label htmlFor={item.id}>{item.label}</Label>
              </>
            )}
          </div>
        ))}
      </LabelInputContainer>
    </div>
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 mb-4">{children}</div>
);
