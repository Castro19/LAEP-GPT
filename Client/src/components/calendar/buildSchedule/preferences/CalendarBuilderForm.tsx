import { calendarActions, useAppDispatch, useAppSelector } from "@/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import {
  InstructorRatingSlider,
  UnitSlider,
  TimeRange,
  FormSwitch,
} from "@/components/section";
import { CALENDAR_PREFERENCES_SCHEMA } from "@/components/section/courseFilters/helpers/constants";

export type CalendarPreferencesForm = z.infer<
  typeof CALENDAR_PREFERENCES_SCHEMA
>;

const CalendarBuilderForm = () => {
  const dispatch = useAppDispatch();
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="my-4 px-1 space-y-8 pb-4">
          <UnitSlider form={form} min={0} max={24} showRange={false} />
          <InstructorRatingSlider form={form} showDescription={false} />
          <TimeRange form={form} />
          <FormSwitch
            form={form}
            label="Show only open classes"
            name="openOnly"
          />
          <FormSwitch
            form={form}
            label="Show overlapping classes"
            name="showOverlappingClasses"
          />
        </div>
      </form>
    </Form>
  );
};

export default CalendarBuilderForm;
