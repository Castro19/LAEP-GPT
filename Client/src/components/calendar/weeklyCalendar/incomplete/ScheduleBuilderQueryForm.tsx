import { useForm } from "react-hook-form";
// import { z } from "zod"; // If you’re using Zod, you can define a schema
// import { zodResolver } from "@hookform/resolvers/zod"; // Then pass as resolver

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
// Replace with your own icons or remove if not needed

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { environment } from "@/helpers/getEnvironmentVars";

// Example arrays
const TIME_OF_DAY = ["Morning", "Afternoon", "Night"] as const;
const COURSE_ATTRIBUTES = [
  "GE D",
  "USCP",
  "GE C",
  "GWR",
  "GE E",
  "GE B",
  "GE F",
  "GE A",
] as const;

// If you use Zod, define it as something like:
const formSchema = z.object({
  openOnly: z.boolean().default(false),
  timeOfDay: z.enum(TIME_OF_DAY).optional(),
  courseIds: z.array(z.string()).default([]),
  courseAttributes: z.array(z.enum(COURSE_ATTRIBUTES)).default([]),
});

const ScheduleBuilderQueryForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      openOnly: false,
      timeOfDay: undefined,
      courseIds: [],
      courseAttributes: [],
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (environment === "dev") {
      console.log("AutoScheduler Filters:", data);
    }
    // TODO: trigger auto-generation of schedules based on these filters
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        {/* Card Container */}
        <Card className="flex flex-col border-0 shadow-lg max-h-[80%]">
          <div className="overflow-auto flex-1">
            <ScrollArea className="h-full min-w-full mb-4">
              {/* Title / Description Section */}
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Build My Class Schedule
                </h2>
                <p className="text-sm text-gray-600">
                  Specify the exact classes you need (e.g., MATH101, PHYS101),
                  and/or select any general requirements you want to fulfill
                  (e.g., <strong>GE A</strong>, <strong>USCP</strong>).
                  We&apos;ll automatically generate potential schedules that
                  meet your chosen criteria.
                </p>
              </div>

              {/* Form Fields */}
              <div className="px-6 space-y-6 pb-6">
                {/* 1. Open Classes Only */}
                <FormField
                  control={form.control}
                  name="openOnly"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Show Only Open Classes
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        If switched on, only sections currently marked as “Open”
                        will be considered.
                      </p>
                    </FormItem>
                  )}
                />

                {/* 2. Preferred Time of Day */}
                <FormField
                  control={form.control}
                  name="timeOfDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Preferred Time of Day
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          {TIME_OF_DAY.map((slot) => (
                            <Button
                              key={slot}
                              type="button"
                              variant={
                                field.value === slot ? "default" : "outline"
                              }
                              onClick={() => form.setValue("timeOfDay", slot)}
                              className="px-4 py-2"
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        When do you prefer to take classes? Leave unselected to
                        consider all times.
                      </p>
                    </FormItem>
                  )}
                />

                {/* 3. Required Course IDs */}
                <FormField
                  control={form.control}
                  name="courseIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Required Courses
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {/* 
                          Replace the Input with a custom multi-course selector if you have one.
                          This example uses a comma-separated approach for simplicity.
                        */}
                          <Input
                            type="text"
                            placeholder="Enter courses, e.g. MATH101, PHYS101, STAT312"
                            value={field.value.join(", ")}
                            onChange={(e) => {
                              const values = e.target.value
                                .split(",")
                                .map((v) => v.trim())
                                .filter(Boolean);
                              field.onChange(values);
                            }}
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        List any classes you must take. We’ll include these in
                        the schedule we generate.
                      </p>
                    </FormItem>
                  )}
                />

                {/* 4. Course Attributes / Requirements */}
                <FormField
                  control={form.control}
                  name="courseAttributes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Requirements to Fulfill
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {COURSE_ATTRIBUTES.map((attr) => {
                            const isSelected = field.value.includes(attr);
                            return (
                              <Button
                                key={attr}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => {
                                  if (isSelected) {
                                    form.setValue(
                                      "courseAttributes",
                                      field.value.filter((a) => a !== attr)
                                    );
                                  } else {
                                    form.setValue("courseAttributes", [
                                      ...field.value,
                                      attr,
                                    ]);
                                  }
                                }}
                                className="h-8 text-sm"
                              >
                                {attr}
                              </Button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        Pick any GE Areas or other attributes you’d like to
                        fulfill. We’ll search for classes meeting these
                        criteria.
                      </p>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
          </div>
        </Card>

        {/* Divider */}
        <div className="border-t border-gray-200 p-4" />

        {/* Sticky footer with Reset and Build */}
        <div className="sticky bottom-0 mx-6 bg-card/95 backdrop-blur flex gap-2 shadow-lg">
          {/* Reset button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="w-full shadow-lg"
          >
            Reset
          </Button>
          {/* Submit button */}
          <Button type="submit" className="w-full shadow-lg">
            Build My Schedule
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleBuilderQueryForm;
