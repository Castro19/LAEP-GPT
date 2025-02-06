import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RiFilterLine, RiStarFill } from "react-icons/ri";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

// Redux hooks and actions
import { useAppDispatch, useAppSelector } from "@/redux";
import { setFilters, fetchSectionsAsync } from "@/redux/section/sectionSlice";
import { SectionsFilterParams } from "@polylink/shared/types";
import InstructorRatingFilter from "../InstructorRatingFilter";
import CourseInformation from "./CourseInformation";
import { SECTION_FILTERS_SCHEMA, DAYS, COURSE_ATTRIBUTES } from "./constants";
import Scheduling from "./Scheduling";
import { environment } from "@/helpers/getEnvironmentVars";
// Define a Zod schema for the filter form.

export type SectionFiltersForm = z.infer<typeof SECTION_FILTERS_SCHEMA>;

export function SectionFilters() {
  const dispatch = useAppDispatch();
  const reduxFilters = useAppSelector((state) => state.section.filters);

  // Initialize the form with default values from Redux, converting as necessary.
  const form = useForm<SectionFiltersForm>({
    resolver: zodResolver(SECTION_FILTERS_SCHEMA),
    defaultValues: {
      courseIds: reduxFilters.courseIds || [],
      status: reduxFilters.status || "",
      subject: reduxFilters.subject || "",
      days: reduxFilters.days
        ? (reduxFilters.days.split(",") as (typeof DAYS)[number][])
        : [],
      startTime: reduxFilters.timeRange
        ? reduxFilters.timeRange.split("-")[0]
        : "07:00",
      endTime: reduxFilters.timeRange
        ? reduxFilters.timeRange.split("-")[1]
        : "20:00",
      instructorRating: reduxFilters.instructorRating || "",
      units: reduxFilters.units ? Number(reduxFilters.units) : 6,
      // Convert the stored string of attributes into an array
      courseAttributes:
        (reduxFilters.courseAttribute as (typeof COURSE_ATTRIBUTES)[number][]) ||
        [],
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

    // Create a filters object matching API's expected shape.
    const updatedFilters: SectionsFilterParams = {
      courseIds: watchedValues.courseIds || [],
      status: watchedValues.status || "",
      subject: watchedValues.subject || "",
      days: watchedValues.days ? watchedValues.days.join(",") : "",
      timeRange,
      instructorRating: watchedValues.instructorRating || "",
      units: watchedValues.units?.toString() || "",
      // Join the array of attributes into a comma-separated string.
      courseAttribute: watchedValues.courseAttributes || [],
      instructionMode: watchedValues.instructionMode || "",
    };

    // Only dispatch if something actually changed.
    if (JSON.stringify(updatedFilters) !== JSON.stringify(reduxFilters)) {
      dispatch(setFilters(updatedFilters));
    }
  }, [watchedValues, dispatch, reduxFilters]);

  // onSubmit is now used only to trigger the API call.
  const onSubmit = (data: SectionFiltersForm) => {
    const timeRange =
      data.startTime && data.endTime ? `${data.startTime}-${data.endTime}` : "";
    if (environment === "dev") {
      console.log("Filtering Query", data);
    }
    const updatedFilters: SectionsFilterParams = {
      courseIds: data.courseIds || [],
      status: data.status || "",
      subject: data.subject || "",
      days: data.days ? data.days.join(",") : "",
      timeRange,
      instructorRating: data.instructorRating || "",
      units: data.units?.toString() || "",
      courseAttribute: data.courseAttributes || [],
      instructionMode: data.instructionMode || "",
    };
    dispatch(setFilters(updatedFilters));
    dispatch(fetchSectionsAsync());
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
                <CourseInformation form={form} />
                <Scheduling form={form} />
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
