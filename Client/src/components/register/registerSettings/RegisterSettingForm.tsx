"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// import { toast } from "@/components/ui/use-toast";
import { CheckboxReactHookFormMultiple } from "./RegisterCheckbox";
import { CheckBoxItem, CheckBoxType } from "@/types/settingFormType";

export default function RegisterSettingForm() {
  const interestItems: CheckBoxItem[] = [
    {
      id: "AI",
      label: "Artificial Intelligence",
    },
    {
      id: "ML",
      label: "Machine Learning",
    },
    {
      id: "Teaching",
      label: "Teaching",
    },
    {
      id: "Data",
      label: "Data Science",
    },
    {
      id: "SWE",
      label: "Software Engineering",
    },
  ] as const;

  // FIX: 1: Add in extra items user will choose as their options (availability, recent projects, etc.). This will have the same obj structure as above.

  //  Define schema here
  // FIX 2: Once you find an extra option, look at the zod documentation and add it in the formSchema
  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  });

  // Define your form
  // FIX 3: Add in the extra option here
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      items: [],
      // Add in here an empty list like items
    },
  });

  // Define the different props here:
  const interestCheckBoxProps: CheckBoxType = {
    form: form,
    boxTitle: "Interests",
    boxDesc: "Select the topics you are interested in.",
    items: interestItems,
  };

  // FIX 4: Create another object with the same properties as the above
  // const TristanCheckBoxProps: CheckBoxType = {
  //   form: form,
  //   boxTitle: "",
  //   boxDesc: "",
  //   items: ,
  // };

  function onSubmit(values) {
    console.log(values);
    console.log("Submit pressed");
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <CheckboxReactHookFormMultiple info={interestCheckBoxProps} />
        {/* FIX 5: Test to make sure its working by adding in child component with your props created 
       <CheckboxReactHookFormMultiple info={TristanCheckBoxProps} 
*/}

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
