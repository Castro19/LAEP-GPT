import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { SECTION_FILTERS_SCHEMA } from "./courseFilters/helpers/constants";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TitleLabel from "./reusable/filter/TitleLabel";

type TermSelectorProps = {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
};

const TermSelector = ({ form }: TermSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="term"
      defaultValue="summer2025"
      render={({ field }) => (
        <FormItem>
          <TitleLabel title="Term" />
          <FormControl>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Spring 2025", "spring2025"],
                ["Summer 2025", "summer2025"],
                ["Fall 2025", "fall2025"],
              ].map(([label, value]) => (
                <Button
                  key={value}
                  type="button"
                  variant={field.value === value ? "default" : "outline"}
                  onClick={() => field.onChange(value)}
                  className="h-8 text-sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default TermSelector;
