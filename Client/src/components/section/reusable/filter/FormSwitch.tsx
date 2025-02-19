import { UseFormReturn } from "react-hook-form";

// My Components

// UI Components
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

type FormSwitchProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  label: string;
  name: string;
  defaultChecked?: boolean;
};

const FormSwitch = ({
  form,
  label,
  name,
  defaultChecked = false,
}: FormSwitchProps) => {
  return (
    <FormItem>
      <div className="flex items-center justify-between gap-1">
        <FormLabel className="font-medium dark:text-gray-400 flex items-center text-md">
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
                  onCheckedChange={field.onChange}
                  defaultChecked={defaultChecked}
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
