import {
  calendarActions,
  flowchartActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BuildScheduleContainer } from "@/components/calendar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaBook } from "react-icons/fa";
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";
import SavedFlowchartList from "./SavedFlowchartList";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import CourseDropdown from "../flowchartSidebar/courses/CourseDropdown";

// Define a schema for flowchart preferences
const FLOWCHART_PREFERENCES_SCHEMA = z.object({
  // Placeholder for flowchart preferences
  // Add actual fields later
});

export type FlowchartPreferencesForm = z.infer<
  typeof FLOWCHART_PREFERENCES_SCHEMA
>;

const FlowchartBuilderForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const calendarPreferences = useAppSelector(
    (state) => state.calendar.preferences
  );

  const form = useForm<FlowchartPreferencesForm>({
    defaultValues: {},
  });

  const watchedValues = form.watch();

  useEffect(() => {
    if (JSON.stringify(watchedValues) !== JSON.stringify(calendarPreferences)) {
      dispatch(calendarActions.setPreferences(watchedValues));
    }
  }, [watchedValues, dispatch, calendarPreferences]);

  const handleCreateFlowchart = () => {
    dispatch(flowchartActions.setCreateFlowchart(true));
    dispatch(flowchartActions.setFlowchartData(null));
    navigate("/flowchart");
  };

  return (
    <>
      <BuildScheduleContainer>
        {/* Placeholder for flowchart components */}
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-4">
            <CollapsibleContentWrapper
              title="Flowchart"
              icon={HiOutlineAcademicCap}
            >
              <SavedFlowchartList />
            </CollapsibleContentWrapper>
            <CollapsibleContentWrapper title="Classes" icon={FaBook}>
              <CourseDropdown />
            </CollapsibleContentWrapper>
          </div>
        </div>
      </BuildScheduleContainer>
      <div className="sticky bottom-0 mx-4 bg-background/95 backdrop-blur flex gap-2 shadow-lg p-4 h-[20%]">
        {/* Apply Filters button */}
        <Button
          type="submit"
          className="w-full shadow-lg dark:bg-gray-100 dark:bg-opacity-90 dark:hover:bg-gray-300 dark:hover:bg-opacity-90"
          onClick={handleCreateFlowchart}
        >
          New Flowchart
        </Button>
      </div>
    </>
  );
};

export default FlowchartBuilderForm;
