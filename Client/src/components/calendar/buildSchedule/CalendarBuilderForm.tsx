import { calendarActions, useAppDispatch, useAppSelector } from "@/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { CALENDAR_PREFERENCES_SCHEMA } from "@/components/section/courseFilters/helpers/constants";
import {
  BuildScheduleContainer,
  generateAllScheduleCombinations,
  SelectedSectionContainer,
} from "..";
import { LeftSectionFooter } from "..";
import { environment } from "@/helpers/getEnvironmentVars";
import { useNavigate } from "react-router-dom";

export type CalendarPreferencesForm = z.infer<
  typeof CALENDAR_PREFERENCES_SCHEMA
>;

const CalendarBuilderForm = () => {
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
    if (environment === "dev") {
      console.log("Building schedule...");
      console.log("FORM PREFERENCES", form.getValues());
    }
    // Create all combinations of sections
    const allCombinations = generateAllScheduleCombinations(selectedSections);
    dispatch(calendarActions.setCalendars(allCombinations));
    dispatch(calendarActions.setPage(1));
    dispatch(calendarActions.setTotalPages(allCombinations.length));
    dispatch(calendarActions.setCurrentCalendar(allCombinations[0]));
    navigate("/calendar");
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
        <BuildScheduleContainer onClick={handleBuildSchedule}>
          <SelectedSectionContainer form={form} />
        </BuildScheduleContainer>
        <LeftSectionFooter
          formText="New Schedule"
          buttonText="Save Schedule"
          onFormSubmit={handleBuildSchedule}
          onClick={handleSaveSchedule}
        />
      </form>
    </Form>
  );
};

export default CalendarBuilderForm;
