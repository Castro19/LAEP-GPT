import { Button } from "@/components/ui/button";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { FlowchartData } from "@/types";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
const FlowChartFooter = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { flowchartData } = useAppSelector((state) => state.flowchart) as {
    flowchartData: FlowchartData | null;
  };
  const { handleSave, handleChange } = useUserData();
  const handleSaveData = async () => {
    if (!flowchartData) {
      navigate("/chat");
      return;
    }
    try {
      const flowchart = await dispatch(
        flowchartActions.postFlowchartInDB(flowchartData)
      ).unwrap(); // Unwraps the result to get the payload or throw error

      if (flowchart && flowchart.flowchartId) {
        handleChange({
          target: { name: "flowchartId", value: flowchart.flowchartId },
        } as React.ChangeEvent<HTMLInputElement>);
        handleSave();
        navigate("/chat");
      } else {
        console.error("Failed to get flowchartId from the response.");
      }
    } catch (error) {
      console.error("Failed to save flowchart:", error);
    }
  };

  return (
    <footer className="flex justify-end p-4">
      <Button onClick={handleSaveData}>Finish</Button>
    </footer>
  );
};

export default FlowChartFooter;
