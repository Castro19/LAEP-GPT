import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate, useParams } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "@/components/ui/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import SpecialButton from "@/components/ui/specialButton";
import { MdSave } from "react-icons/md";
import { environment } from "@/helpers/getEnvironmentVars";

const FlowChartFooter = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isMobile } = useSidebar();
  const { flowchartData, flowchartList, currentFlowchart } = useAppSelector(
    (state) => state.flowchart
  );
  const { flowchartId } = useParams();
  const { handleSave, handleChange } = useUserData();

  const handleSaveData = async () => {
    if (!flowchartData) {
      navigate("/chat");
      return;
    }
    let flowchart;
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
          handleChange("flowchartId", flowchart.flowchartId);
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
    } finally {
      if ((flowchartList ?? []).length < 1) {
        handleChange("flowchartId", flowchart?.flowchartId ?? "");
        handleSave();
        navigate("/chat");
      }

      toast({
        title: "Flowchart Saved",
        description: "Your flowchart has been saved successfully.",
      });
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
          name: currentFlowchart?.name ?? "",
          primaryOption: currentFlowchart?.primaryOption ?? false,
        })
      ).unwrap();
      navigate(`/flowchart/${flowchartId}`);
      toast({
        title: "Flowchart Updated",
        description: "Your flowchart has been updated successfully.",
      });
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to update flowchart:", error);
      }
    }
  };

  return (
    <footer className="flex flex-col justify-between items-center p-4 w-full gap-4">
      {isMobile && (
        <div className="flex justify-center items-center w-full">
          {flowchartId === "" || flowchartId === undefined ? (
            <SpecialButton
              onClick={handleSaveData}
              text="Save"
              icon={<MdSave />}
              className="flex-1 w-[80vw]"
            />
          ) : (
            <SpecialButton
              onClick={handleUpdateData}
              text="Update"
              icon={<MdSave />}
              className="flex-1 w-[80vw]"
            />
          )}
        </div>
      )}
    </footer>
  );
};

export default FlowChartFooter;
