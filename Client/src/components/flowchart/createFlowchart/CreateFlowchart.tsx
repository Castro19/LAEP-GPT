/**
 * @component CreateFlowchart
 * @description Main component for creating academic flowcharts (academic schedules). Manages
 * the flowchart creation process with progress tracking and user selections.
 *
 * @props
 * @prop {() => void} onSwitchTab - Optional callback for tab switching after creation
 *
 * @dependencies
 * - Redux: flowchartActions, flowSelectionActions, userActions
 * - React Router: Navigation to created flowchart
 * - ProgressBar: Progress tracking component
 * - FlowchartOptions: Selection interface
 * - useUserData: User data management
 * - fetchFlowchartDataHelper: Flowchart data fetching
 *
 * @features
 * - 4-step progress tracking (Starting Year, Catalog, Major, Concentration)
 * - User year to start year conversion
 * - Flowchart data fetching and database saving
 * - Primary flowchart setting
 * - User data updates
 * - Navigation to created flowchart
 * - Toast notifications for errors
 * - Responsive design
 *
 * @example
 * ```tsx
 * <CreateFlowchart onSwitchTab={() => setActiveTab('flowchart')} />
 * ```
 */

import { useNavigate } from "react-router-dom";
import {
  flowchartActions,
  flowSelectionActions,
  useAppDispatch,
  useAppSelector,
  userActions,
} from "@/redux";
import { fetchFlowchartDataHelper } from "@/redux/flowchart/api-flowchart";

// UI Components
import { ProgressBar, FlowchartOptions } from "@/components/flowchart";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// Hooks
import { useUserData } from "@/hooks/useUserData";

// Env vars
import { environment } from "@/helpers/getEnvironmentVars";

// Types
import { FlowchartData } from "@polylink/shared/types";
import { useEffect } from "react";

const userYearToStartYear = (userYear: string): string => {
  switch (userYear) {
    case "senior":
      return "2021";
    case "junior":
      return "2022";
    case "sophomore":
      return "2023";
    case "freshman":
      return "2024";
    default:
      return "2024";
  }
};
const CreateFlowchart = ({ onSwitchTab }: { onSwitchTab?: () => void }) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { selections } = useAppSelector((state) => state.flowSelection);
  const { flowchartList } = useAppSelector((state) => state.flowchart);

  const { userData, handleSave } = useUserData();
  const { toast } = useToast();

  // Calculate progress (1/4, 2/4, 3/4, 4/4)
  const stepsCompleted =
    (selections.startingYear || userData.year ? 1 : 0) +
    (selections.catalog ? 1 : 0) +
    (selections.major ? 1 : 0) +
    (selections.concentration ? 1 : 0);

  const progress = (stepsCompleted / 4) * 100; // Convert to percentage
  const isComplete = stepsCompleted === 4;

  useEffect(() => {
    if (selections.catalog && selections.major) {
      dispatch(
        flowSelectionActions.fetchConcentrationOptions({
          catalog: selections.catalog,
          major: selections.major,
        })
      );
    }
  }, [selections.catalog, selections.major, dispatch]);

  useEffect(() => {
    if (selections.catalog) {
      dispatch(flowSelectionActions.fetchMajorOptions(selections.catalog));
    }
  }, [selections.catalog, dispatch]);

  const handleSaveFlowchart = async () => {
    if (
      isComplete &&
      selections.catalog &&
      selections.major &&
      selections.concentration &&
      (selections.startingYear || userYearToStartYear(userData.year))
    ) {
      const flowchartData = await fetchFlowchartDataHelper(
        dispatch,
        selections.catalog,
        selections.major,
        selections.concentration.code,
        selections.startingYear ?? userYearToStartYear(userData.year),
        true
      );
      await saveFlowchartToDB(flowchartData);
    } else {
      toast({
        title: "Please select a catalog, major, and concentration",
        description: "You must select all options to create a flowchart",
        variant: "destructive",
      });
    }
    if (onSwitchTab) {
      onSwitchTab();
    }
  };

  const saveFlowchartToDB = async (flowchartData: FlowchartData) => {
    let flowchart;

    if (!flowchartData) {
      return;
    }
    try {
      // Create a new object with the updated startYear instead of modifying the original
      const updatedFlowchartData = {
        ...flowchartData,
        startYear:
          selections.startingYear ?? userYearToStartYear(userData.year),
      };

      flowchart = await dispatch(
        flowchartActions.postFlowchartInDB({
          flowchartData: updatedFlowchartData,
          name: flowchartData.name,
          // If there are no flowcharts in the database, set the new flowchart as primary
          primaryOption: (flowchartList ?? []).length === 0,
        })
      ).unwrap(); // Unwraps the result to get the payload or throw error

      if (flowchart && flowchart.flowchartId) {
        if (flowchart.primaryOption) {
          dispatch(
            userActions.updateUserData({
              flowchartInformation: {
                flowchartId: flowchart.flowchartId,
                concentration: selections.concentration?.code ?? "",
                major: selections.major ?? "",
                catalog: selections.catalog ?? "",
                startingYear:
                  userData.flowchartInformation.startingYear ??
                  userYearToStartYear(userData.year),
              },
            })
          );

          handleSave();
        }
        dispatch(flowchartActions.setCreateFlowchart(false));
        navigate(`/flowchart/${flowchart.flowchartId}`);
      } else {
        if (environment === "dev") {
          console.error("Failed to get flowchartId from the response.");
        }
      }
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to save flowchart:", error);
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-start px-4 sm:px-6 md:px-8">
      <div className="flex flex-col items-center w-full max-w-4xl mt-8 sm:mt-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Academic Path
          </h1>
          <p className="text-sm sm:text-md text-gray-400 mt-1">
            Configure your academic journey
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-4">
          <ProgressBar value={progress} />
          <p className="text-xs sm:text-sm text-gray-400 mt-1 text-center">
            {stepsCompleted}/{4} Steps Completed
          </p>
        </div>

        {/* Selections */}
        <div className="w-full mt-4">
          <FlowchartOptions type="flowchart" />
        </div>

        {/* Generate Flowchart Button */}
        <div
          className="w-full mt-6"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <Button
            className={`w-full py-2 sm:py-3 text-base sm:text-lg transition-all font-semibold rounded-md mb-4 ${
              isComplete
                ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleSaveFlowchart}
            disabled={!isComplete}
          >
            Generate Flowchart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlowchart;
