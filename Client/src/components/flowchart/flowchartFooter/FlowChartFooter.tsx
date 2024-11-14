import { Button } from "@/components/ui/button";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
const FlowChartFooter = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const { flowchartId } = useAppSelector((state) => state.user.userData);
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
        handleChange("flowchartId", flowchart.flowchartId);
        handleSave();
        navigate("/chat");
      } else {
        console.error("Failed to get flowchartId from the response.");
      }
    } catch (error) {
      console.error("Failed to save flowchart:", error);
    }
  };

  const handleUpdateData = async () => {
    console.log("flowchartId: ", flowchartId);
    if (!flowchartData) {
      navigate("/chat");
      return;
    }

    await dispatch(
      flowchartActions.updateFlowchart({
        flowchartId,
        flowchartData,
        name: flowchartData.name,
      })
    );
  };
  console.log("flowchartId: ", flowchartId);
  return (
    <footer className="flex justify-end p-4">
      {flowchartId === "" ? (
        <Button onClick={handleSaveData}>Finish</Button>
      ) : (
        <Button onClick={handleUpdateData}>Update</Button>
      )}
    </footer>
  );
};

export default FlowChartFooter;
