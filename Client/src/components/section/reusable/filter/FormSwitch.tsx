import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

// My Components
import { SECTION_FILTERS_SCHEMA } from "../../courseFilters/helpers/constants";

// UI Components
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

// Types
type FormSwitchProps = {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
  label: string;
  name: keyof z.infer<typeof SECTION_FILTERS_SCHEMA>;
};

const FormSwitch = ({ form, label, name }: FormSwitchProps) => {
  return (
    <FormItem>
      <div className="flex items-center justify-between gap-1">
        <FormLabel className="font-medium dark:text-gray-400 flex items-center text-sm">
          {label}
        </FormLabel>
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => {
            return (
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    form.setValue(name, checked);
                  }}
                />
              </FormControl>
            );
          }}
        />
      </div>
    </FormItem>
  );
};

export default FormSwitch;
