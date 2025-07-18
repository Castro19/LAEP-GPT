/**
 * @component FlowchartBuilderForm
 * @description Main side panel form for flowchart management. Provides flowchart info,
 * saved flowcharts list, course dropdowns, and new flowchart creation.
 *
 * @props
 * @prop {() => void} onSwitchTab - Optional callback for tab switching
 *
 * @dependencies
 * - Redux: flowchartActions for flowchart management
 * - React Router: Navigation to flowchart pages
 * - BuildScheduleContainer: Layout container
 * - SavedFlowchartList: List of user's saved flowcharts
 * - CourseDropdown: Course selection interface
 * - FlowchartInfo: Current flowchart information
 * - CollapsibleContentWrapper: Collapsible sections
 *
 * @features
 * - Flowchart information display
 * - Saved flowcharts management
 * - Course selection and search
 * - New flowchart creation
 * - Tab switching integration
 * - Responsive design
 * - Sticky bottom navigation
 *
 * @example
 * ```tsx
 * <FlowchartBuilderForm onSwitchTab={() => setActiveTab('flowchart')} />
 * ```
 */

import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { flowchartActions, useAppDispatch } from "@/redux";

// My Components
import { BuildScheduleContainer } from "@/components/scheduleBuilder";
import { SavedFlowchartList, CourseDropdown } from "@/components/flowchart";
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";
import FlowchartInfo from "./flowchartInfo/FlowchartInfo";
// UI Components
import { Button } from "@/components/ui/button";

// Icons
import { FaBook } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi2";

// Define a schema for flowchart preferences
const FLOWCHART_PREFERENCES_SCHEMA = z.object({
  // Placeholder for flowchart preferences
  // Add actual fields later
});

export type FlowchartPreferencesForm = z.infer<
  typeof FLOWCHART_PREFERENCES_SCHEMA
>;

const FlowchartBuilderForm = ({
  onSwitchTab,
}: {
  onSwitchTab?: () => void;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCreateFlowchart = () => {
    dispatch(flowchartActions.setCreateFlowchart(true));
    dispatch(flowchartActions.setFlowchartData(null));

    // Call onSwitchTab if provided to switch to the Flowchart tab
    if (onSwitchTab) {
      onSwitchTab();
    }

    navigate("/flowchart");
  };

  return (
    <>
      <BuildScheduleContainer>
        {/* Placeholder for flowchart components */}
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-4">
            <CollapsibleContentWrapper
              title="Flowchart Info"
              icon={HiOutlineAcademicCap}
            >
              <FlowchartInfo />
            </CollapsibleContentWrapper>
            <CollapsibleContentWrapper
              title="Saved Flowcharts"
              icon={HiOutlineAcademicCap}
            >
              <SavedFlowchartList onSwitchTab={onSwitchTab} />
            </CollapsibleContentWrapper>
            <CollapsibleContentWrapper title="Courses" icon={FaBook}>
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
