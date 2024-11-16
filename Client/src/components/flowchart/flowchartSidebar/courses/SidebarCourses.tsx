import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandLoading } from "cmdk";

const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  // Add more frameworks as needed
];

export function SidebarCourses() {
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Check if there are any matches
  const hasMatches = frameworks.some((framework) =>
    framework.label.toLowerCase().includes(inputValue.toLowerCase())
  );
  const loading = false;
  return (
    <Command>
      <CommandInput
        placeholder="Search for a class"
        value={inputValue}
        onValueChange={(value: string) => setInputValue(value)}
      />
      <CommandList>
        {loading ? (
          <CommandLoading>Hang on…</CommandLoading>
        ) : (
          <>
            {/* Show CommandEmpty if no matches and input is not empty */}
            {inputValue !== "" && !hasMatches && (
              <CommandEmpty>No Class found.</CommandEmpty>
            )}
            <CommandGroup>
              {frameworks.map((framework) => {
                const isVisible =
                  inputValue === "" ||
                  framework.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                return (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue: string) => {
                      setValue(currentValue === value ? "" : currentValue);
                    }}
                    className={cn({ "max-h-0": !isVisible })}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}

export default SidebarCourses;
