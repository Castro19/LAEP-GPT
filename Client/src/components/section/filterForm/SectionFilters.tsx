import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// UI
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

// Components
import CourseInformation from "./CourseInformation";
import Instructor from "./Instructor";
import Scheduling from "./Scheduling";

// Redux hooks and actions
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  setFilters,
  fetchSectionsAsync,
  setIsInitialState,
  setPage,
} from "@/redux/section/sectionSlice";
import { SectionsFilterParams } from "@polylink/shared/types";

// Constants
import { SECTION_FILTERS_SCHEMA, DAYS, COURSE_ATTRIBUTES } from "./constants";

// Environment
import { environment } from "@/helpers/getEnvironmentVars";
import QueryAI from "./QueryAI";
import { useUserData } from "@/hooks/useUserData";
import useMobile from "@/hooks/use-mobile";

// Define a Zod schema for the filter form.

export type SectionFiltersForm = z.infer<typeof SECTION_FILTERS_SCHEMA>;

export function SectionFilters() {
  const isMobile = useMobile();
  const dispatch = useAppDispatch();
  const reduxFilters = useAppSelector((state) => state.section.filters);
  const { userData } = useUserData();
  const { major, concentration } = userData.flowchartInformation;

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
      minInstructorRating: reduxFilters.minInstructorRating || "",
      maxInstructorRating: reduxFilters.maxInstructorRating || "",
      includeUnratedInstructors: reduxFilters.includeUnratedInstructors,
      minUnits: reduxFilters.minUnits || "",
      maxUnits: reduxFilters.maxUnits || "",
      // Convert the stored string of attributes into an array
      courseAttributes:
        (reduxFilters.courseAttribute as (typeof COURSE_ATTRIBUTES)[number][]) ||
        [],
      instructionMode: reduxFilters.instructionMode || "",
      instructors: reduxFilters.instructors || [],
      isTechElective: reduxFilters.isTechElective || false,
      techElectives: {
        major: major,
        concentration: concentration,
      },
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
      minInstructorRating: watchedValues.minInstructorRating || "",
      maxInstructorRating: watchedValues.maxInstructorRating || "",
      includeUnratedInstructors: watchedValues.includeUnratedInstructors,
      minUnits: watchedValues.minUnits || "",
      maxUnits: watchedValues.maxUnits || "",
      // Join the array of attributes into a comma-separated string.
      courseAttribute: watchedValues.courseAttributes || [],
      instructionMode: watchedValues.instructionMode || "",
      instructors: watchedValues.instructors || [],
      isTechElective: watchedValues.isTechElective || false,
      techElectives: watchedValues.techElectives || {
        major: "",
        concentration: "",
      },
    };

    // Only dispatch if something actually changed.
    if (JSON.stringify(updatedFilters) !== JSON.stringify(reduxFilters)) {
      dispatch(setFilters(updatedFilters));
    }
  }, [watchedValues, dispatch, reduxFilters]);

  // onSubmit is now used only to trigger the API call.
  const onSubmit = (data: SectionFiltersForm) => {
    dispatch(setIsInitialState(false));
    dispatch(setPage(1));
    const timeRange =
      data.startTime && data.endTime ? `${data.startTime}-${data.endTime}` : "";

    const updatedFilters: SectionsFilterParams = {
      courseIds: data.courseIds || [],
      minUnits: data.minUnits || "",
      maxUnits: data.maxUnits || "",
      courseAttribute: data.courseAttributes || [],
      subject: data.subject || "",
      days: data.days ? data.days.join(",") : "",
      timeRange,
      status: data.status || "",
      instructionMode: data.instructionMode || "",
      minInstructorRating: data.minInstructorRating || "",
      maxInstructorRating: data.maxInstructorRating || "",
      includeUnratedInstructors: data.includeUnratedInstructors,
      instructors: data.instructors || [],
      techElectives: data.techElectives || {
        major: "",
        concentration: "",
      },
      isTechElective: data.isTechElective || false,
    };

    // For example, build query string:
    const queryString = buildQueryString(updatedFilters);
    if (environment === "dev") {
      console.log("Filtering Query", queryString);
    }
    // You can then use queryString in your API call.
    dispatch(setFilters(updatedFilters));
    dispatch(fetchSectionsAsync());
  };

  function buildQueryString(filters: SectionsFilterParams): string {
    const params = new URLSearchParams();

    // Add simple (string or number) filter values.
    if (filters.courseIds && filters.courseIds.length > 0) {
      params.append("courseIds", filters.courseIds.join(","));
    }
    if (filters.status) params.append("status", filters.status);
    if (filters.subject) params.append("subject", filters.subject);
    if (filters.days) params.append("days", filters.days);
    if (filters.timeRange) params.append("timeRange", filters.timeRange);
    if (filters.minInstructorRating)
      params.append("minInstructorRating", filters.minInstructorRating);
    if (filters.maxInstructorRating)
      params.append("maxInstructorRating", filters.maxInstructorRating);
    params.append(
      "includeUnratedInstructors",
      String(filters.includeUnratedInstructors)
    );
    if (filters.minUnits) params.append("minUnits", filters.minUnits);
    if (filters.maxUnits) params.append("maxUnits", filters.maxUnits);
    // If courseAttribute is an array
    if (filters.courseAttribute && filters.courseAttribute.length > 0) {
      params.append("courseAttribute", filters.courseAttribute.join(","));
    }
    if (filters.instructionMode)
      params.append("instructionMode", filters.instructionMode);
    if (filters.instructors && filters.instructors.length > 0) {
      params.append("instructors", filters.instructors.join(","));
    }

    // For techElectives, flatten it to two query parameters.
    params.append("techElectives.major", filters.techElectives?.major || "");
    params.append(
      "techElectives.concentration",
      filters.techElectives?.concentration || ""
    );

    return params.toString();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col ${isMobile ? "h-[90%]" : "h-full"}`}
      >
        <Card className="flex flex-col border-0 shadow-lg no-scroll max-h-[83%]">
          <div className="overflow-auto flex-1 no-scroll">
            <ScrollArea className="h-full min-w-full mb-4">
              <div className="p-4">
                <div className="flex items-center justify-center space-x-2">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Course Filters
                  </h2>
                </div>
              </div>

              <div className="px-6 space-y-4 pb-4">
                <CourseInformation form={form} />
                {/* Border with pop up effect*/}
                <div className="border-t border-slate-600" />
                <Scheduling form={form} />
                {/* Border */}
                <div className="border-t border-slate-600" />
                <Instructor form={form} />
                {/* Border */}
                <div className="border-t border-slate-600" />
                <QueryAI />
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
