import { calendarActions, useAppDispatch, useAppSelector } from "@/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { CALENDAR_PREFERENCES_SCHEMA } from "@/components/classSearch/courseFilters/helpers/constants";
import { BuildScheduleContainer, SelectedSectionContainer } from "..";
import { buildSchedule } from "@/components/calendar/helpers";
import { LeftSectionFooter } from "..";
import { environment } from "@/helpers/getEnvironmentVars";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export type CalendarPreferencesForm = z.infer<
  typeof CALENDAR_PREFERENCES_SCHEMA
>;

const CalendarBuilderForm = ({
  onSwitchTab,
}: {
  // eslint-disable-next-line no-unused-vars
  onSwitchTab: (tab: string) => void;
}) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  const { currentCalendar } = useAppSelector((state) => state.calendar);
  const calendarPreferences = useAppSelector(
    (state) => state.calendar.preferences
  );
  const form = useForm<CalendarPreferencesForm>({
    resolver: zodResolver(CALENDAR_PREFERENCES_SCHEMA),
    defaultValues: calendarPreferences,
  });
  const watchedValues = form.watch();

  useEffect(() => {
    if (JSON.stringify(watchedValues) !== JSON.stringify(calendarPreferences)) {
      dispatch(calendarActions.setPreferences(watchedValues));
    }
  }, [watchedValues, dispatch, calendarPreferences]);

  const onSubmit = (data: CalendarPreferencesForm) => {
    console.log(data);
  };

  // Handle the build schedule button click
  const handleBuildSchedule = () => {
    if (!selectedSections || selectedSections.length === 0) {
      toast({
        title: "No sections found",
        description: "Please add at least one section to build a schedule",
        variant: "destructive",
        action: (
          <ToastAction
            className="bg-black border-white border-2"
            altText="Add Sections"
            onClick={() => {
              navigate("/class-search");
            }}
          >
            Add Sections
          </ToastAction>
        ),
      });
      return;
    }
    if (environment === "dev") {
      console.log("Building schedule...");
      console.log("FORM PREFERENCES", form.getValues());
      console.log("SELECTED SECTIONS", selectedSections);
      console.log("CURRENT CALENDAR", currentCalendar);
    }
    // Create all combinations of sections
    const allCombinations = buildSchedule(selectedSections, form.getValues());
    dispatch(calendarActions.setCalendars(allCombinations));
    dispatch(calendarActions.setPage(1));
    dispatch(calendarActions.setTotalPages(allCombinations.length));
    dispatch(calendarActions.setCurrentCalendar(allCombinations[0]));
    navigate("/calendar");
    onSwitchTab("Calendar");
  };

  const handleSaveSchedule = () => {
    if (currentCalendar) {
      dispatch(
        calendarActions.createOrUpdateCalendarAsync(currentCalendar.sections)
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <BuildScheduleContainer>
          <SelectedSectionContainer form={form} />
        </BuildScheduleContainer>
        <LeftSectionFooter
          formText="Generate Schedule"
          buttonText="Save Schedule"
          onFormSubmit={handleBuildSchedule}
          onClick={handleSaveSchedule}
        />
      </form>
    </Form>
  );
};

export default CalendarBuilderForm;
