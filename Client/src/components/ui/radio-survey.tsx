import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function RadioSurvey({
  items,
  label,
  handleChange,
}: {
  items: { id: string; label: string }[];
  label: string;
  // eslint-disable-next-line no-unused-vars
  handleChange: (value: string) => void;
}) {
  const [showTextArea, setShowTextArea] = useState(false);
  const [other, setOther] = useState("");

  const handleOptionChange = (value: string) => {
    if (value === "other") {
      setShowTextArea(true);
    } else {
      setShowTextArea(false);
      handleChange(value);
    }
  };

  const handleOtherChange = (value: string) => {
    setOther(value);
    handleChange(value);
  };

  return (
    <LabelInputContainer>
      <Label className="text-lg align-start mb-4">{label}</Label>
      <RadioGroup onValueChange={handleOptionChange} className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            {item.id === "other" ? (
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row space-x-2">
                  <RadioGroupItem value={item.id} id={item.id} />
                  <Label htmlFor={item.id}>{item.label}</Label>
                </div>
                {showTextArea && (
                  <Textarea
                    className="w-full animate-in fade-in-0 slide-in-from-top-10 duration-300"
                    placeholder="Please specify"
                    id="gender-other"
                    maxLength={25}
                    value={other}
                    onChange={(e) => handleOtherChange(e.target.value)}
                  />
                )}
              </div>
            ) : (
              <>
                <RadioGroupItem value={item.id} id={item.id} />
                <Label htmlFor={item.id}>{item.label}</Label>
              </>
            )}
          </div>
        ))}
      </RadioGroup>
    </LabelInputContainer>
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 mb-4">{children}</div>
);
