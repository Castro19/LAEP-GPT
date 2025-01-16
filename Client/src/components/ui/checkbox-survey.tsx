import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/useUserData";
import { UserData } from "@polylink/shared/types";
import { useState } from "react";
import { ITEMS } from "@/calpolyData/items";
import { motion } from "framer-motion";

type CheckboxSurveyProps = {
  label: string;
  // eslint-disable-next-line no-unused-vars
  handleChange: (value: string[]) => void;
  className?: string;
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
export function CheckboxSurvey({
  label,
  handleChange,
  className,
}: CheckboxSurveyProps) {
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
      return userData.interestAreas.includes(item);
    } else if (label === "What activities do you like to do?") {
      return userData.preferredActivities.includes(item);
    } else if (label === "Goals for your college experience") {
      return userData.goals.includes(item);
    }
    return false;
  };
  return (
    <div className={className}>
      <LabelInputContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ITEMS[label].map((item) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={item.id}
              className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {item.id === "other" ? (
                <div className="flex flex-col space-y-2 w-full">
                  <div className="flex flex-row space-x-2 items-center">
                    <Checkbox
                      id={item.id}
                      checked={isChecked(item.label)}
                      onCheckedChange={(checked) =>
                        handleItemChange(checked as boolean, item.label)
                      }
                      className="text-blue-500"
                    />
                    <Label htmlFor={item.id} className="font-medium">
                      {item.label}
                    </Label>
                  </div>
                  {showTextAreaItem && (
                    <Textarea
                      className="w-full animate-in fade-in-0 slide-in-from-top-10 duration-300 text-sm"
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
                    className="mt-0.5 text-blue-500"
                  />
                  <Label
                    htmlFor={item.id}
                    className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </Label>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </LabelInputContainer>
    </div>
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2">{children}</div>
);
