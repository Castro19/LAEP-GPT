import { z } from "zod";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

// My Components
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";
import { FormSwitch, TimeRange, TitleLabel } from "@/components/classSearch";

// UI Components
import {
  FormControl,
  FormLabel,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ReusableDropdown from "@/components/ui/reusable-dropdown";

// Icons
import { FaClock } from "react-icons/fa";

// Constants
import {
  DAYS,
  HOURS,
  SECTION_FILTERS_SCHEMA,
} from "@/components/classSearch/courseFilters/helpers/constants";
import { useNavigate } from "react-router-dom";

const Scheduling = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  const navigate = useNavigate();

  const statusOptions = [
    { label: "Open", value: "open" },
    { label: "Waitlist", value: "waitlist" },
    { label: "Closed", value: "closed" },
  ];

  return (
    <CollapsibleContentWrapper
      title="Scheduling"
      icon={FaClock}
      defaultOpen={false}
    >
      {/* Days Selector */}
      <FormField
        control={form.control}
        name="days"
        render={({ field }) => (
          <FormItem>
            <TitleLabel title="Days" />
            <FormControl>
              <DaysSelector field={field} form={form} />
            </FormControl>
          </FormItem>
        )}
      />
      <TimeRange form={form} />
      {/* Status Toggle */}
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <TitleLabel title="Enrollment Status" />
            <FormControl>
              <div className="flex gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    className="w-1/4"
                    variant={
                      field.value === option.value ? "default" : "outline"
                    }
                    onClick={() =>
                      form.setValue(
                        "status",
                        field.value === option.value ? "" : option.value
                      )
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      {/* Instruction Mode */}
      <FormField
        control={form.control}
        name="instructionMode"
        render={({ field }) => (
          <FormItem>
            <TitleLabel title="Instruction Mode" />
            <FormControl>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["In-Person", "PS"],
                  ["Asynchronous", "SA"],
                  ["Synchronous", "PA"],
                  ["In-Person/Async Hybrid", "P"],
                  ["In-Person/Sync Hybrid", "AM"],
                  ["Sync/Async Hybrid", "SM"],
                ].map(([mode, code]) => (
                  <Button
                    key={mode}
                    type="button"
                    variant={field.value === code ? "default" : "outline"}
                    onClick={() =>
                      form.setValue(
                        "instructionMode",
                        field.value === code ? "" : code
                      )
                    }
                    className="h-8 text-sm"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="withNoConflicts"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FormSwitch
                form={form}
                label="No Time Conflicts"
                name="withNoConflicts"
                defaultChecked={field.value}
              />
            </FormControl>
            {field.value && (
              <div className="flex flex-col gap-1">
                <FormLabel className="font-medium dark:text-gray-400 flex items-center text-sm">
                  Only show sections with no time conflicts with your primary
                  schedule.
                </FormLabel>
                <FormLabel className="font-medium dark:text-gray-400 flex items-center text-sm mr-1">
                  Set your primary schedule in{"  "}
                  <span
                    className="text-blue-500 cursor-pointer ml-1"
                    onClick={() => {
                      navigate("/schedule-builder");
                    }}
                  >
                    {"  "} Schedule Builder
                  </span>
                </FormLabel>
              </div>
            )}
          </FormItem>
        )}
      />
    </CollapsibleContentWrapper>
  );
};

const DaysSelector = ({
  field,
  form,
}: {
  field: ControllerRenderProps<z.infer<typeof SECTION_FILTERS_SCHEMA>, "days">;
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
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

export const TimeRangeSelector = ({
  name,
  form,
}: {
  name: "startTime" | "endTime";
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  const hourLabels = HOURS.map(hourIntToLabel);

  return (
    <div className="flex flex-col gap-3 items-start">
      <FormLabel className="text-sm font-medium dark:text-gray-300">
        {name === "startTime" ? "From" : "To"}
      </FormLabel>

      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          const selectedLabel = valueToLabel(field.value ?? "");

          // Update the form's "HH:MM" value whenever user picks a new label
          const handleChangeItem = (_: string, label: string) => {
            field.onChange(labelToValue(label));
          };

          return (
            <FormControl>
              <ReusableDropdown
                name={name}
                dropdownItems={hourLabels}
                selectedItem={selectedLabel}
                handleChangeItem={handleChangeItem}
                placeholder="Select a time…"
                className="w-full mt-1 dark:bg-zinc-950 dark:text-slate-200 text-sm font-medium"
              />
            </FormControl>
          );
        }}
      />
    </div>
  );
};

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

function hourIntToLabel(h24: number): string {
  const amPm = h24 < 12 ? "AM" : "PM";
  let h12 = h24 % 12;
  if (h12 === 0) {
    h12 = 12;
  }
  return `${h12}:00${amPm}`;
}

function valueToLabel(value: string): string {
  // If empty or missing, return an empty string.
  if (!value) return "";
  // Expecting "HH:MM"
  const [hourStr] = value.split(":");
  const hourInt = parseInt(hourStr, 10) || 0;
  return hourIntToLabel(hourInt);
}

/**
 * Convert a label like "1:00PM" => "13:00" (24-hour string).
 */
function labelToValue(label: string): string {
  // e.g. "1:00PM" => hour=1, amPm="PM" => "13:00"
  // Quick parse:
  // - split by ":" => ["1", "00PM"]
  // - hour12 = 1
  // - last 2 chars => "PM"
  // - so if "PM" and hour12 < 12 => hour12 + 12
  // - handle "12:00AM" => "00:00"
  const [hrStr, rest] = label.split(":"); // e.g. ["1", "00PM"]
  const hour12 = parseInt(hrStr, 10);
  const amPm = rest.slice(-2); // e.g. "PM"
  let hour24 = hour12;
  if (amPm === "PM" && hour12 !== 12) {
    hour24 += 12;
  } else if (amPm === "AM" && hour12 === 12) {
    hour24 = 0;
  }
  // Return zero-padded, plus ":00"
  return String(hour24).padStart(2, "0") + ":00";
}

export default Scheduling;
