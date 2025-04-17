import { scheduleActions, useAppDispatch, useAppSelector } from "@/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { SCHEDULE_PREFERENCES_SCHEMA } from "@/components/classSearch/courseFilters/helpers/constants";
import { BuildScheduleContainer, SelectedSectionContainer } from "..";
import { buildSchedule } from "@/components/scheduleBuilder/helpers";
import { LeftSectionFooter } from "..";
import { environment } from "@/helpers/getEnvironmentVars";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { generatedScheduleToSchedule } from "@/components/scheduleBuilder/helpers/scheduleTransformers";

export type SchedulePreferencesForm = z.infer<
  typeof SCHEDULE_PREFERENCES_SCHEMA
>;

const ScheduleBuilderForm = ({
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
  const { currentSchedule, currentScheduleTerm } = useAppSelector(
    (state) => state.schedule
  );
  const schedulePreferences = useAppSelector(
    (state) => state.schedule.preferences
  );
  const form = useForm<SchedulePreferencesForm>({
    resolver: zodResolver(SCHEDULE_PREFERENCES_SCHEMA),
    defaultValues: schedulePreferences,
  });
  const watchedValues = form.watch();

  useEffect(() => {
    if (JSON.stringify(watchedValues) !== JSON.stringify(schedulePreferences)) {
      dispatch(scheduleActions.setPreferences(watchedValues));
    }
  }, [watchedValues, dispatch, schedulePreferences]);

  const onSubmit = (data: SchedulePreferencesForm) => {
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
      console.log("CURRENT SCHEDULE", currentSchedule);
    }
    // Create all combinations of sections
    const allCombinations = buildSchedule(selectedSections, form.getValues());
    dispatch(scheduleActions.setSchedules(allCombinations));
    dispatch(scheduleActions.setPage(1));
    dispatch(scheduleActions.setTotalPages(allCombinations.length));

    // Set the first generated schedule as current
    if (allCombinations.length > 0) {
      dispatch(scheduleActions.setCurrentSchedule(allCombinations[0]));
    }

    navigate("/schedule-builder");
    onSwitchTab("schedule-builder");
  };

  const handleSaveSchedule = () => {
    if (currentSchedule) {
      // Convert GeneratedSchedule to Schedule type for saving
      const scheduleToSave = generatedScheduleToSchedule(currentSchedule);

      dispatch(
        scheduleActions.createOrUpdateScheduleAsync({
          sections: scheduleToSave.sections,
          term: currentScheduleTerm,
        })
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

export default ScheduleBuilderForm;
