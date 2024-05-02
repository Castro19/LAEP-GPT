import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckBoxType } from "@/types/settingFormType";

type CheckboxReactHookFormMultipleProps = {
  info: CheckBoxType;
};

export function CheckboxReactHookFormMultiple({
  info,
}: CheckboxReactHookFormMultipleProps) {
  const { form, boxTitle, boxDesc, items } = info;
  return (
    <FormField
      control={form.control}
      name="items"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">{boxTitle}</FormLabel>
            <FormDescription>{boxDesc}</FormDescription>
          </div>
          {items.map((item) => (
            <FormField
              key={item.id}
              control={form.control}
              name="items"
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== item.id
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{item.label}</FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
