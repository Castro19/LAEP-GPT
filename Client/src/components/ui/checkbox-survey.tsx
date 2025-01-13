import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

type CheckboxSurveyProps = {
  items: { id: string; label: string }[];
  label: string;
};

export function CheckboxSurvey({ items, label }: CheckboxSurveyProps) {
  const [showTextAreaItem, setShowTextAreaItem] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [otherItem, setOtherItem] = useState("");

  const handleItemChange = (checked: boolean, value: string) => {
    if (checked) {
      if (value === "other") {
        setShowTextAreaItem(true);
        if (otherItem) {
          setSelectedItems((prev) => [...prev, otherItem]);
        }
      }

      setSelectedItems((prev) => [...prev, value]);
    } else {
      if (value === "other") {
        setShowTextAreaItem(false);
        setSelectedItems((prev) =>
          prev.filter((interest) => interest !== otherItem)
        );
      }
      setSelectedItems((prev) => prev.filter((interest) => interest !== value));
    }
  };

  const handleOtherItemChange = (value: string) => {
    setOtherItem(value);
    setSelectedItems((prev) => {
      const withoutOther = prev.filter((interest) => interest !== otherItem);
      return [...withoutOther, value];
    });
  };

  useEffect(() => {
    console.log(selectedItems.filter((interest) => interest !== "other"));
  }, [selectedItems]);

  return (
    <div>
      <LabelInputContainer>
        <Label className="text-lg align-start mb-4">{label}</Label>
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            {item.id === "other" ? (
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleItemChange(checked as boolean, item.id)
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
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) =>
                    handleItemChange(checked as boolean, item.id)
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
