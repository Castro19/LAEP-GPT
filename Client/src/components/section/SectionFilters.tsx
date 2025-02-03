import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RiFilterLine, RiStarFill } from "react-icons/ri";

// UI Components from your design system
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SectionCourseDropdown from "./SectionCourseDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";

// Redux hooks and actions
import { useAppDispatch, useAppSelector } from "@/redux";
import { setFilters, fetchSectionsAsync } from "@/redux/section/sectionSlice";
import { SectionsFilterParams } from "@polylink/shared/types";
import InstructorRatingFilter from "./InstructorRatingFilter";

// Days allowed (used in the Zod enum)
const days = ["Mo", "Tu", "We", "Th", "Fr"] as const;

// Potential Course Attributes
const courseAttributes = [
  "GE A",
  "GE B",
  "GE C",
  "GE D",
  "GWR",
  "USCP",
] as const;

// Define a Zod schema for the filter form.
const sectionFiltersSchema = z.object({
  courseId: z.string().optional(),
  status: z.string().optional(),
  subject: z.string().optional(),
  // The "days" field is an array of allowed day strings.
  days: z.array(z.enum(days)).optional(),
  // Capture start and end times separately.
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  instructorRating: z.string().optional(),
  units: z.string().optional(),
  // Allow multiple course attributes
  courseAttributes: z.array(z.enum(courseAttributes)).optional(),
  instructionMode: z.string().optional(),
});

export type SectionFiltersForm = z.infer<typeof sectionFiltersSchema>;

export function SectionFilters() {
  const dispatch = useAppDispatch();
  const reduxFilters = useAppSelector((state) => state.section.filters);

  // Initialize the form with default values from Redux, splitting comma-separated lists into arrays.
  const form = useForm<SectionFiltersForm>({
    resolver: zodResolver(sectionFiltersSchema),
    defaultValues: {
      courseId: reduxFilters.courseId || "",
      status: reduxFilters.status || "",
      subject: reduxFilters.subject || "",
      days: reduxFilters.days
        ? (reduxFilters.days.split(",") as (typeof days)[number][])
        : [],
      startTime: reduxFilters.timeRange
        ? reduxFilters.timeRange.split("-")[0]
        : "",
      endTime: reduxFilters.timeRange
        ? reduxFilters.timeRange.split("-")[1]
        : "",
      instructorRating: reduxFilters.instructorRating || "",
      units: reduxFilters.units || "",
      // Convert the stored string of attributes into an array
      courseAttributes: reduxFilters.courseAttribute
        ? (reduxFilters.courseAttribute.split(
            ","
          ) as (typeof courseAttributes)[number][])
        : [],
      instructionMode: reduxFilters.instructionMode || "",
    },
  });

  // Watch the form values so that any change triggers an update to Redux.
  const watchedValues = form.watch();

  useEffect(() => {
    // Combine the start and end times into one "timeRange" value.
    const timeRange =
      watchedValues.startTime && watchedValues.endTime
        ? `${watchedValues.startTime}-${watchedValues.endTime}`
        : "";

    // Create a filters object matching your API's expected shape.
    const updatedFilters: SectionsFilterParams = {
      courseId: watchedValues.courseId || "",
      status: watchedValues.status || "",
      subject: watchedValues.subject || "",
      days: watchedValues.days ? watchedValues.days.join(",") : "",
      timeRange,
      instructorRating: watchedValues.instructorRating || "",
      units: watchedValues.units || "",
      // Join the array of attributes into a comma-separated string.
      courseAttribute: watchedValues.courseAttributes
        ? watchedValues.courseAttributes.join(",")
        : "",
      instructionMode: watchedValues.instructionMode || "",
    };

    // Only dispatch if something actually changed.
    if (JSON.stringify(updatedFilters) !== JSON.stringify(reduxFilters)) {
      dispatch(setFilters(updatedFilters));
      console.log(updatedFilters);
    }
  }, [watchedValues, dispatch, reduxFilters]);

  // onSubmit is now used only to trigger the API call.
  const onSubmit = (data: SectionFiltersForm) => {
    const timeRange =
      data.startTime && data.endTime ? `${data.startTime}-${data.endTime}` : "";

    const updatedFilters: SectionsFilterParams = {
      courseId: data.courseId || "",
      status: data.status || "",
      subject: data.subject || "",
      days: data.days ? data.days.join(",") : "",
      timeRange,
      instructorRating: data.instructorRating || "",
      units: data.units || "",
      courseAttribute: data.courseAttributes
        ? data.courseAttributes.join(",")
        : "",
      instructionMode: data.instructionMode || "",
    };

    console.log("FETCHING FILTERS", updatedFilters);
    dispatch(fetchSectionsAsync(updatedFilters));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <Card className="flex flex-col border-0 shadow-lg no-scroll max-h-[83%]">
          <div className="overflow-auto flex-1 no-scroll">
            <ScrollArea className="h-full min-w-full mb-4">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-center space-x-2">
                  <RiFilterLine className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Filter Sections
                  </h2>
                </div>
              </div>

              <div className="px-6 space-y-6 pb-4">
                {/* Course Search */}
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Course
                      </FormLabel>
                      <FormControl>
                        <SectionCourseDropdown
                          onSelect={(courseId) =>
                            form.setValue("courseId", courseId)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Status Toggle */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Status
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={
                              field.value === "open" ? "default" : "outline"
                            }
                            onClick={() => form.setValue("status", "open")}
                            className="px-4 py-2"
                          >
                            Open
                          </Button>
                          <Button
                            type="button"
                            variant={
                              field.value === "closed" ? "default" : "outline"
                            }
                            onClick={() => form.setValue("status", "closed")}
                            className="px-4 py-2"
                          >
                            Closed
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Days Selector */}
                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Days
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-2">
                          {days.map((day) => {
                            const isSelected = field.value?.includes(day);
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
                                      field.value?.filter((d) => d !== day) ||
                                        []
                                    );
                                  } else {
                                    // add to array
                                    form.setValue("days", [
                                      ...(field.value || []),
                                      day,
                                    ]);
                                  }
                                }}
                                className="h-8"
                              >
                                {day}
                              </Button>
                            );
                          })}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Time Range Slider */}
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Time Range
                  </FormLabel>
                  <div className="flex gap-3 items-center">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="w-full p-2 border rounded-lg"
                          />
                        </FormControl>
                      )}
                    />
                    <span className="text-gray-500">to</span>
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="w-full p-2 border rounded-lg"
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </FormItem>

                {/* Instructor Rating */}
                <FormField
                  control={form.control}
                  name="instructorRating"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          Instructor Rating ≥ {field.value || 0}
                          <RiStarFill className="inline-block w-4 h-4 ml-1 text-yellow-500" />
                        </FormLabel>
                        <FormControl className="flex-1 ml-4">
                          <InstructorRatingFilter
                            initialRating={
                              field.value ? parseFloat(field.value) : undefined
                            }
                            onRatingChange={(rating) =>
                              form.setValue(
                                "instructorRating",
                                rating.toString()
                              )
                            }
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Units Selector */}
                <FormField
                  control={form.control}
                  name="units"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Units
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {["1-3", "4+"].map((unit) => (
                            <Button
                              key={unit}
                              type="button"
                              variant={
                                field.value === unit ? "default" : "outline"
                              }
                              onClick={() => form.setValue("units", unit)}
                              className="h-8"
                            >
                              {unit}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Course Attributes - Multiple Toggles */}
                <FormField
                  control={form.control}
                  name="courseAttributes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Course Attributes
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {courseAttributes.map((attr) => {
                            const isSelected = field.value?.includes(attr);
                            return (
                              <Button
                                key={attr}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => {
                                  if (isSelected) {
                                    // remove from array
                                    form.setValue(
                                      "courseAttributes",
                                      field.value?.filter((a) => a !== attr) ||
                                        []
                                    );
                                  } else {
                                    // add to array
                                    form.setValue("courseAttributes", [
                                      ...(field.value || []),
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
                    </FormItem>
                  )}
                />

                {/* Instruction Mode */}
                <FormField
                  control={form.control}
                  name="instructionMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Instruction Mode
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {["In-Person", "Hybrid", "Online"].map((mode) => (
                            <Button
                              key={mode}
                              type="button"
                              variant={
                                field.value === mode ? "default" : "outline"
                              }
                              onClick={() =>
                                form.setValue("instructionMode", mode)
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
              </div>
            </ScrollArea>
          </div>
        </Card>
        {/* Divider */}
        <div className="border-t border-gray-200 p-4" />
        {/* Sticky footer with Reset and Apply */}
        <div className="sticky bottom-0 mx-6 bg-background/95 backdrop-blur flex gap-2 shadow-lg">
          {/* Reset Filters button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Resets the entire form to its initial defaultValues.
              form.reset();
            }}
            className="w-full shadow-lg"
          >
            Reset Filters
          </Button>
          {/* Apply Filters button */}
          <Button type="submit" className="w-full shadow-lg">
            Apply Filters
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SectionFilters;
