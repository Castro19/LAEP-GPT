import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export function RadioSurvey({
  items,
  label,
}: {
  items: { id: string; label: string }[];
  label: string;
}) {
  const [showTextArea, setShowTextArea] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [other, setOther] = useState("");

  const handleChange = (value: string) => {
    if (value === "other") {
      setShowTextArea(true);
      setSelected(other || "");
    } else {
      setShowTextArea(false);
      setSelected(value);
    }
  };

  const handleOtherChange = (value: string) => {
    setOther(value);
    setSelected(value);
  };

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  return (
    <LabelInputContainer>
      <Label className="text-lg align-start mb-4">{label}</Label>
      <RadioGroup onValueChange={handleChange} className="space-y-2">
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
