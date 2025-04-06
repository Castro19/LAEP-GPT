import { useNavigate } from "react-router-dom";
import {
  flowchartActions,
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

const CreateFlowchart = () => {
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

  const handleSaveFlowchart = async () => {
    if (
      isComplete &&
      selections.catalog &&
      selections.major &&
      selections.concentration &&
      (selections.startingYear || userData.year)
    ) {
      const flowchartData = await fetchFlowchartDataHelper(
        dispatch,
        selections.catalog,
        selections.major,
        selections.concentration.code,
        selections.startingYear ?? userData.year,
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
  };

  const saveFlowchartToDB = async (flowchartData: FlowchartData) => {
    let flowchart;

    if (!flowchartData) {
      return;
    }
    try {
      console.log("Flowchart Data", flowchartData);
      // Create a new object with the updated startYear instead of modifying the original
      const updatedFlowchartData = {
        ...flowchartData,
        startYear: selections.startingYear ?? userData.year,
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
                  userData.flowchartInformation.startingYear ?? 2022,
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
    <div className="h-screen flex justify-center items-start ml-12">
      <div className="flex flex-col items-center w-full max-w-4xl mt-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Academic Path</h1>
          <p className="text-md text-gray-400 mt-1">
            Configure your academic journey
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-4">
          <ProgressBar value={progress} />
          <p className="text-sm text-gray-400 mt-1 text-center">
            {stepsCompleted}/{4} Steps Completed
          </p>
        </div>

        {/* Selections */}
        <div className="w-full mt-4">
          <FlowchartOptions type="flowchart" />
        </div>

        {/* Generate Flowchart Button */}
        <div className="w-full mt-6">
          <Button
            className={`w-full py-3 text-lg transition-all font-semibold rounded-md ${
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
