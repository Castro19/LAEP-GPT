import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sectionActions, useAppDispatch, useAppSelector } from "@/redux";
import { environment } from "@/helpers/getEnvironmentVars";

// Hooks
import { useUserData } from "@/hooks/useUserData";

// Components
import SectionFilters from "@/components/section/courseFilters/SectionFilters";
import {
  BuildScheduleContainer,
  LeftSectionFooter,
} from "@/components/calendar";
import { Form } from "@/components/ui/form";

// Types
import { SectionsFilterParams } from "@polylink/shared/types";

// Constants
import {
  COURSE_ATTRIBUTES,
  DAYS,
} from "@/components/section/courseFilters/helpers/constants";
import { SECTION_FILTERS_SCHEMA } from "@/components/section/courseFilters/helpers/constants";
import useDeviceType from "@/hooks/useDeviceType";
import MobileBuildScheduleContainer from "@/components/calendar/buildSchedule/layout/MobileBuildScheduleContainer";
export type SectionFiltersForm = z.infer<typeof SECTION_FILTERS_SCHEMA>;

const SectionForm = ({
  onSwitchTab,
}: {
  // eslint-disable-next-line no-unused-vars
  onSwitchTab?: (tab: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const deviceType = useDeviceType();

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
        : "",
      endTime: reduxFilters.timeRange
        ? reduxFilters.timeRange.split("-")[1]
        : "",
      minInstructorRating: reduxFilters.minInstructorRating || "",
      maxInstructorRating: reduxFilters.maxInstructorRating || "",
      includeUnratedInstructors: reduxFilters.includeUnratedInstructors,
      minUnits: reduxFilters.minUnits || "",
      maxUnits: reduxFilters.maxUnits || "",
      minCatalogNumber: reduxFilters.minCatalogNumber || "",
      maxCatalogNumber: reduxFilters.maxCatalogNumber || "",
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
      withNoConflicts: reduxFilters.withNoConflicts || false,
      isCreditNoCredit: reduxFilters.isCreditNoCredit || false,
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
      minCatalogNumber: watchedValues.minCatalogNumber || "",
      maxCatalogNumber: watchedValues.maxCatalogNumber || "",
      // Join the array of attributes into a comma-separated string.
      courseAttribute: watchedValues.courseAttributes || [],
      instructionMode: watchedValues.instructionMode || "",
      instructors: watchedValues.instructors || [],
      isTechElective: watchedValues.isTechElective || false,
      techElectives: watchedValues.techElectives || {
        major: "",
        concentration: "",
      },
      withNoConflicts: watchedValues.withNoConflicts || false,
      isCreditNoCredit: watchedValues.isCreditNoCredit || false,
    };

    // Only dispatch if something actually changed.
    if (JSON.stringify(updatedFilters) !== JSON.stringify(reduxFilters)) {
      dispatch(sectionActions.setFilters(updatedFilters));
    }
  }, [watchedValues, dispatch, reduxFilters]);

  // onSubmit is now used only to trigger the API call.
  const onSubmit = (data: SectionFiltersForm) => {
    dispatch(sectionActions.setIsInitialState(false));
    dispatch(sectionActions.setPage(1));
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
      minCatalogNumber: data.minCatalogNumber || "",
      maxCatalogNumber: data.maxCatalogNumber || "",
      includeUnratedInstructors: data.includeUnratedInstructors,
      instructors: data.instructors || [],
      techElectives: data.techElectives || {
        major: "",
        concentration: "",
      },
      isTechElective: data.isTechElective || false,
      withNoConflicts: data.withNoConflicts || false,
      isCreditNoCredit: data.isCreditNoCredit || false,
    };

    // For example, build query string:
    const queryString = buildQueryString(updatedFilters);
    if (environment === "dev") {
      console.log("Filtering Query", queryString);
    }
    // You can then use queryString in your API call.
    dispatch(sectionActions.setFilters(updatedFilters));
    dispatch(sectionActions.fetchSectionsAsync());
    if (onSwitchTab) {
      // Trigger tab switch
      onSwitchTab("sections");
    }
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
    if (filters.isTechElective) {
      params.append("isTechElective", "true");
    }
    // For techElectives, flatten it to two query parameters.
    if (filters.techElectives?.major) {
      params.append("techElectives.major", filters.techElectives?.major);
    }
    if (filters.techElectives?.concentration) {
      params.append(
        "techElectives.concentration",
        filters.techElectives?.concentration
      );
    }
    if (filters.withNoConflicts) {
      params.append("withNoConflicts", "true");
    }
    if (filters.isCreditNoCredit) {
      params.append("isCreditNoCredit", "true");
    }
    return params.toString();
  }

  const onFormReset = () => {
    form.reset();
    dispatch(sectionActions.setIsInitialState(true));
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {deviceType !== "desktop" ? (
            <MobileBuildScheduleContainer
              onFormSubmit={() => onSubmit(form.getValues())}
              onClick={onFormReset}
            >
              <SectionFilters form={form} />
            </MobileBuildScheduleContainer>
          ) : (
            <>
              <BuildScheduleContainer>
                <SectionFilters form={form} />
              </BuildScheduleContainer>
              <LeftSectionFooter
                formText="Apply Filters"
                buttonText="Reset Filters"
                onFormSubmit={() => {
                  onSubmit(form.getValues());
                }}
                onClick={onFormReset}
              />
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default SectionForm;
