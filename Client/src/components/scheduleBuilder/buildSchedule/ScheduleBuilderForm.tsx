import {
  classSearchActions,
  scheduleActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { SCHEDULE_PREFERENCES_SCHEMA } from "@/components/classSearch/courseFilters/helpers/constants";
import { BuildScheduleContainer, SelectedSectionContainer } from "..";
import { buildSchedule } from "@/components/scheduleBuilder/helpers";
import { LeftSectionFooter } from "..";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { generatedScheduleToSchedule } from "@/components/scheduleBuilder/helpers/scheduleTransformers";
import { GeneratedSchedule, Preferences } from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";

export type SchedulePreferencesForm = z.infer<
  typeof SCHEDULE_PREFERENCES_SCHEMA
>;

/**
 * ScheduleBuilderForm - Main form component for building and managing schedules
 *
 * This component provides the core interface for schedule building functionality, including:
 * - Form management for schedule preferences using react-hook-form and zod validation
 * - Schedule generation from selected sections
 * - Schedule saving and updating capabilities
 * - Navigation between different schedule builder tabs
 * - Error handling and user feedback via toast notifications
 *
 * @component
 * @param {Object} props - Component props
 * @param {function} props.onSwitchTab - Callback function to switch between tabs in the schedule builder
 *
 * @example
 * ```tsx
 * <ScheduleBuilderForm onSwitchTab={(tab) => setActiveTab(tab)} />
 * ```
 *
 * @dependencies
 * - Redux store for state management (schedule, sectionSelection)
 * - React Router for navigation
 * - React Hook Form for form handling
 * - Zod for schema validation
 * - Toast notifications for user feedback
 *
 * @features
 * - Real-time preference updates synced with Redux store
 * - Automatic schedule generation from selected sections
 * - Conflict detection and handling
 * - Schedule persistence with database integration
 * - Responsive design with mobile support
 *
 * @state
 * - Form state managed by react-hook-form
 * - Redux state for selected sections, current schedule, and preferences
 * - URL parameters for schedule ID
 */
const ScheduleBuilderForm = ({
  onSwitchTab,
}: {
  // eslint-disable-next-line no-unused-vars
  onSwitchTab: (tab: string) => void;
}) => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();

  const dispatch = useAppDispatch();
  const { selectedSections, sectionsForSchedule } = useAppSelector(
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
      dispatch(scheduleActions.setPreferences(watchedValues as Preferences));
    }
  }, [watchedValues, dispatch, schedulePreferences]);

  const onSubmit = (data: SchedulePreferencesForm) => {
    if (environment === "dev") {
      console.log("SUBMITTED DATA: ", data);
    }
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
              dispatch(
                classSearchActions.setFilters({
                  term: currentScheduleTerm,
                })
              );
              navigate("/class-search");
            }}
          >
            Add Sections
          </ToastAction>
        ),
      });
      return;
    }

    // Check if any sections are selected for the schedule
    if (sectionsForSchedule.length === 0) {
      toast({
        title: "No sections selected",
        description:
          "Please select at least one section to include in your schedule",
        variant: "destructive",
      });
      return;
    }
    dispatch(scheduleActions.setCurrentScheduleId(undefined));

    // Create all combinations of sections
    const allCombinations = buildSchedule(
      sectionsForSchedule,
      form.getValues()
    );
    dispatch(scheduleActions.setSchedules(allCombinations));
    dispatch(scheduleActions.setPage(1));
    dispatch(scheduleActions.setTotalPages(allCombinations.length));

    // Set the first generated schedule as current
    if (allCombinations.length > 0) {
      dispatch(scheduleActions.setCurrentSchedule(allCombinations[0]));
    }
    dispatch(scheduleActions.setCurrentScheduleId(undefined));

    navigate("/schedule-builder");
    onSwitchTab("schedule-builder");
  };

  const handleSaveSchedule = () => {
    if (currentSchedule) {
      // Convert GeneratedSchedule to Schedule type for saving
      const scheduleToSave = generatedScheduleToSchedule(
        currentSchedule,
        currentSchedule.name,
        currentScheduleTerm
      );

      dispatch(
        scheduleActions.createOrUpdateScheduleAsync({
          classNumbers: scheduleToSave.sections.map(
            (section) => section.classNumber
          ),
          customEvents: scheduleToSave.customEvents,
          term: currentScheduleTerm,
          scheduleId: scheduleId,
        })
      );
      toast({
        title: scheduleId ? "Schedule updated" : "Schedule created",
        description: `Your schedule has been ${
          scheduleId ? "updated" : "created"
        }`,
      });
    } else {
      const currentBlankSchedule: GeneratedSchedule = {
        sections: [],
        customEvents: [],
        name: "New Schedule",
        id: "",
        averageRating: 0,
      };

      dispatch(scheduleActions.setCurrentSchedule(currentBlankSchedule));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <BuildScheduleContainer>
          <SelectedSectionContainer form={form} onSwitchTab={onSwitchTab} />
        </BuildScheduleContainer>
        <LeftSectionFooter
          formText="Generate Schedule"
          buttonText={
            scheduleId
              ? "Update Schedule"
              : currentSchedule
                ? "Save Schedule"
                : "New Schedule"
          }
          onFormSubmit={handleBuildSchedule}
          onClick={handleSaveSchedule}
        />
      </form>
    </Form>
  );
};

export default ScheduleBuilderForm;
