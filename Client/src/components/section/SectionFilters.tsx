import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { RiFilterLine } from "react-icons/ri";

// UI Components from your design system
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SectionCourseDropdown from "./SectionCourseDropdown";

// Redux hooks and actions
import { useAppDispatch, useAppSelector } from "@/redux";
import { setFilters, fetchSectionsAsync } from "@/redux/section/sectionSlice";
import { SectionsFilterParams } from "@polylink/shared/types";

// Days allowed (used in the Zod enum)
const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

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
  courseAttribute: z.string().optional(),
  instructionMode: z.string().optional(),
});

export type SectionFiltersForm = z.infer<typeof sectionFiltersSchema>;

export function SectionFilters() {
  const dispatch = useAppDispatch();
  const reduxFilters = useAppSelector((state) => state.section.filters);

  // Initialize the form with default values from Redux.
  const form = useForm<SectionFiltersForm>({
    resolver: zodResolver(sectionFiltersSchema),
    defaultValues: {
      courseId: reduxFilters.courseId || "",
      status: reduxFilters.status || "",
      subject: reduxFilters.subject || "",
      days: reduxFilters.days
        ? (reduxFilters.days.split(",") as (typeof days)[number][])
        : [],
      // If a combined timeRange exists in Redux, split it.
      startTime: reduxFilters.timeRange
        ? reduxFilters.timeRange.split("-")[0]
        : "",
      endTime: reduxFilters.timeRange
        ? reduxFilters.timeRange.split("-")[1]
        : "",
      instructorRating: reduxFilters.instructorRating || "",
      units: reduxFilters.units || "",
      courseAttribute: reduxFilters.courseAttribute || "",
      instructionMode: reduxFilters.instructionMode || "",
    },
  });

  // Watch the form values so that any change triggers an update.
  const watchedValues = form.watch();

  useEffect(() => {
    // Combine the start and end times into one "timeRange" value.
    const timeRange =
      watchedValues.startTime && watchedValues.endTime
        ? `${watchedValues.startTime}-${watchedValues.endTime}`
        : "";
    // Create a filters object matching your API’s expected shape.
    const updatedFilters: SectionsFilterParams = {
      courseId: watchedValues.courseId || "",
      status: watchedValues.status || "",
      subject: watchedValues.subject || "",
      days: watchedValues.days ? watchedValues.days.join(",") : "",
      timeRange,
      instructorRating: watchedValues.instructorRating || "",
      units: watchedValues.units || "",
      courseAttribute: watchedValues.courseAttribute || "",
      instructionMode: watchedValues.instructionMode || "",
    };

    // Check if the new filters are different from the current Redux filters
    if (JSON.stringify(updatedFilters) !== JSON.stringify(reduxFilters)) {
      // Dispatch the updated filters to Redux only if they have changed.
      dispatch(setFilters(updatedFilters));
      console.log(updatedFilters);
    }
  }, [watchedValues, dispatch, reduxFilters]);

  // onSubmit is now used only to trigger the API call.
  const onSubmit = (data: SectionFiltersForm) => {
    // Reconstruct the filters in the same way (or use reduxFilters if in sync).
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
      courseAttribute: data.courseAttribute || "",
      instructionMode: data.instructionMode || "",
    };
    console.log("FETCHING FILTERS", updatedFilters);
    // Trigger the API call with the current filters.
    dispatch(fetchSectionsAsync(updatedFilters));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <RiFilterLine className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Filter Sections</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Narrow down the available sections
          </p>
        </div>

        {/* The Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* --- Important Fields at the Top --- */}
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course ID</FormLabel>
                  <FormControl>
                    {/* Use the dropdown to update the form state */}
                    <SectionCourseDropdown
                      onSelect={(courseId) => {
                        form.setValue("courseId", courseId, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Other Filter Options --- */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Days Checkboxes */}
            <FormItem>
              <FormLabel>Days</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2 mt-1">
                  {days.map((day) => (
                    <label key={day} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        value={day}
                        // This checkbox is controlled by React Hook Form.
                        checked={form.getValues("days")?.includes(day)}
                        onChange={(e) => {
                          const currentDays = form.getValues("days") || [];
                          if (e.target.checked) {
                            form.setValue("days", [...currentDays, day]);
                          } else {
                            form.setValue(
                              "days",
                              currentDays.filter((d) => d !== day)
                            );
                          }
                        }}
                        className="p-1 border border-gray-300 rounded"
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Time Range */}
            <div className="flex flex-col gap-2">
              <FormLabel>Time Range</FormLabel>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Instructor Rating */}
            <FormField
              control={form.control}
              name="instructorRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor Rating (≥)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="0 - 5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Units */}
            <FormField
              control={form.control}
              name="units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="1-3">1-3</option>
                      <option value="4+">4+</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course Attribute */}
            <FormField
              control={form.control}
              name="courseAttribute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Attribute</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="GE A">GE A</option>
                      <option value="GE B">GE B</option>
                      <option value="GE C">GE C</option>
                      <option value="GE D">GE D</option>
                      <option value="GE E">GE E</option>
                      <option value="GE F">GE F</option>
                      <option value="USCP">USCP</option>
                      <option value="GWR">GWR</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Instruction Mode */}
            <FormField
              control={form.control}
              name="instructionMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruction Mode</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="PA">PA (Synchronous)</option>
                      <option value="SM">SM (Sync/Async Hybrid)</option>
                      <option value="P">P (In Person/Async Hybrid)</option>
                      <option value="PS">PS (In Person)</option>
                      <option value="AM">AM (In Person/Sync Hybrid)</option>
                      <option value="SA">SA (Asynchronous)</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button (for API query) */}
            <Button type="submit">Apply Filters</Button>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
