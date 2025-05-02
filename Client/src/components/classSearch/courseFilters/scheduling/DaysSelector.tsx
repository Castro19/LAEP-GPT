import { Button } from "@/components/ui/button";
import { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { DAYS } from "../helpers/constants";

const dayFormatter = (day: string) => {
  switch (day) {
    case "Mo":
      return "Mon";
    case "Tu":
      return "Tue";
    case "We":
      return "Wed";
    case "Th":
      return "Thu";
    case "Fr":
      return "Fri";
  }
};

const DaysSelector = ({
  field,
  form,
}: {
  field: ControllerRenderProps<z.infer<any>, "days">;
  form: UseFormReturn<z.infer<any>>;
}) => {
  // Ensure field.value is always an array, even when reset
  const selectedDays = Array.isArray(field.value) ? field.value : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day);
        return (
          <Button
            key={day}
            type="button"
            variant={isSelected ? "default" : "outline"}
            onClick={() => {
              if (isSelected) {
                // remove from array
                form.setValue(
                  "days",
                  selectedDays.filter((d: string) => d !== day)
                );
              } else {
                // add to array
                form.setValue("days", [...selectedDays, day]);
              }
            }}
            className="h-8"
          >
            {dayFormatter(day)}
          </Button>
        );
      })}
    </div>
  );
};

export default DaysSelector;
