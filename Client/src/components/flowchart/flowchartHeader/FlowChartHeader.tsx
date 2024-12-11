// FlowChartHeader.tsx
import { useSidebar } from "@/components/ui/sidebar";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate, useParams } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "@/components/ui/use-toast";
import { BsLayoutSidebar } from "react-icons/bs";
import SpecialButton from "@/components/ui/specialButton";
import { MdSave } from "react-icons/md";
import { environment } from "@/helpers/getEnvironmentVars";

const FlowChartHeader = () => {
  const { toggleSidebar, isMobile } = useSidebar();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 dark:border-slate-700 shadow-md transition-all duration-300">
      <div className="flex items-center justify-between relative">
        <button onClick={toggleSidebar} className="text-lg hover:text-gray-300">
          <BsLayoutSidebar />
        </button>

        <h1
          className={`text-lg font-bold ${isMobile ? "absolute left-1/2 -translate-x-1/2" : "ml-20"}`}
        >
          Flowchart
        </h1>

        {!isMobile && (
          <div className="flex items-center">
            <span className="mr-2">
              {flowchartId === "" || flowchartId === undefined ? (
                <SpecialButton
                  onClick={handleSaveData}
                  text="Save"
                  icon={<MdSave />}
                  className="dark:bg-green-700 dark:hover:bg-green-700 flex-1 w-32"
                />
              ) : (
                <SpecialButton
                  onClick={handleUpdateData}
                  text="Update"
                  icon={<MdSave />}
                  className="dark:bg-green-700 dark:hover:bg-green-700 flex-1 w-32"
                />
              )}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default FlowChartHeader;
