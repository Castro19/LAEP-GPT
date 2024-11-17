import { Button } from "@/components/ui/button";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate, useParams } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { setIsNewUser } from "@/redux/auth/authSlice";
import { toast } from "@/components/ui/use-toast";

const FlowChartFooter = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { flowchartData, flowchartList } = useAppSelector(
    (state) => state.flowchart
  );
  const { flowchartId } = useParams();
  const { handleSave, handleChange } = useUserData();
  const { isNewUser } = useAppSelector((state) => state.auth);

  const handleSaveData = async () => {
    if (!flowchartData) {
      navigate("/chat");
      return;
    }
    try {
      const flowchart = await dispatch(
        flowchartActions.postFlowchartInDB({
          flowchartData,
          name: flowchartData.name,
          // If there are no flowcharts in the database, set the new flowchart as primary
          primaryOption: (flowchartList ?? []).length === 0,
        })
      ).unwrap(); // Unwraps the result to get the payload or throw error

      if (flowchart && flowchart.flowchartId) {
        if (flowchart.primaryOption) {
          handleChange("flowchartId", flowchart.flowchartId);
          handleSave();
        }
        navigate(`/flowchart/${flowchart.flowchartId}`);
      } else {
        console.error("Failed to get flowchartId from the response.");
      }
    } catch (error) {
      console.error("Failed to save flowchart:", error);
    } finally {
      if (isNewUser) {
        dispatch(setIsNewUser(false));
        navigate("/chat");
      } else {
        toast({
          title: "Flowchart Saved",
          description: "Your flowchart has been saved successfully.",
        });
      }
    }
  };

  const handleUpdateData = async () => {
    if (!flowchartData) {
      navigate("/chat");
      return;
    }
    try {
      await dispatch(
        flowchartActions.updateFlowchart({
          flowchartId: flowchartId ?? "",
          flowchartData,
          name: flowchartData.name,
          primaryOption: false,
        })
      ).unwrap();
      navigate(`/flowchart/${flowchartId}`);
      toast({
        title: "Flowchart Updated",
        description: "Your flowchart has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update flowchart:", error);
    }
  };

  return (
    <footer className="flex flex-col justify-between items-center p-4 w-full gap-4">
      <div className="flex justify-center items-center w-3/4">
        {flowchartId === "" || flowchartId === undefined ? (
          <Button onClick={handleSaveData} className="flex-1">
            Save
          </Button>
        ) : (
          <Button onClick={handleUpdateData} className="flex-1">
            Update
          </Button>
        )}
      </div>
    </footer>
  );
};

export default FlowChartFooter;
