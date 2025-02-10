import FlowChartOptions from "../register/SignInFlow/FlowChartOptions";
import { useNavigate } from "react-router-dom";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { fetchFlowchartDataHelper } from "@/redux/flowchart/api-flowchart";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import ProgressBar from "./ProgressBar";
import { useUserData } from "@/hooks/useUserData";
import { environment } from "@/helpers/getEnvironmentVars";
import { FlowchartData } from "@polylink/shared/types";
const EmptyFlowchart = () => {
  const { selections } = useAppSelector((state) => state.flowSelection);
  const { userData, handleChangeFlowchartInformation, handleSave } =
    useUserData();
  const { flowchartList } = useAppSelector((state) => state.flowchart);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Calculate progress (1/3, 2/3, 3/3)
  const stepsCompleted =
    (selections.catalog ? 1 : 0) +
    (selections.major ? 1 : 0) +
    (selections.concentration ? 1 : 0);

  const progress = (stepsCompleted / 3) * 100; // Convert to percentage
  const isComplete = stepsCompleted === 3;

  const handleSaveFlowchart = async () => {
    if (
      isComplete &&
      selections.catalog &&
      selections.major &&
      selections.concentration
    ) {
      const flowchartData = await fetchFlowchartDataHelper(
        dispatch,
        selections.catalog,
        selections.major,
        selections.concentration.code,
        userData.year,
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
      flowchart = await dispatch(
        flowchartActions.postFlowchartInDB({
          flowchartData,
          name: flowchartData.name,
          // If there are no flowcharts in the database, set the new flowchart as primary
          primaryOption: (flowchartList ?? []).length === 0,
        })
      ).unwrap(); // Unwraps the result to get the payload or throw error

      if (flowchart && flowchart.flowchartId) {
        if (flowchart.primaryOption) {
          handleChangeFlowchartInformation(
            "flowchartId",
            flowchart.flowchartId
          );
          handleSave();
        }
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
            {stepsCompleted}/3 Steps Completed
          </p>
        </div>

        {/* Selections */}
        <div className="w-full mt-4">
          <FlowChartOptions type="flowchart" />
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

export default EmptyFlowchart;
