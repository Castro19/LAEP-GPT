import { useNavigate } from "react-router-dom";
// Redux
import {
  useAppSelector,
  useAppDispatch,
  messageActions,
  flowchartActions,
} from "@/redux";
import { FetchAllFlowchartsResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/useUserData";

type FlowchartLogProps = {
  flowchart: FetchAllFlowchartsResponse;
  // eslint-disable-next-line no-unused-vars
  onSelectFlowchart: (flowchartId: string) => void;
};

const FlowchartLog = ({ flowchart, onSelectFlowchart }: FlowchartLogProps) => {
  const navigate = useNavigate();
  const { handleSave, handleChange } = useUserData();
  // Redux:
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.message.error);

  const handleSelectFlowchart = async (flowchartId: string) => {
    onSelectFlowchart(flowchartId);
    navigate(`/flowchart/${flowchartId}`);
    if (error) {
      dispatch(messageActions.clearError());
    }
  };

  const handleDeleteFlowchart = async (flowchartId: string) => {
    await dispatch(flowchartActions.deleteFlowchart(flowchartId));
    dispatch(flowchartActions.resetFlowchartData());
    handleChange("flowchartId", "");
    handleSave();
    navigate("/flowchart");
    console.log("Delete flowchartId: ", flowchartId);
  };

  return (
    <div className="flex align-center justify-between mb-1 pb-1 border-b border-gray-500 dark:border-gray-700">
      <button
        onClick={() => handleSelectFlowchart(flowchart.flowchartId)}
        className="
          block
          w-full
          px-4 py-2
          my-1 mx-0
          cursor-pointer
          rounded-lg
          bg-gray-100 dark:bg-gray-800
          hover:bg-blue-100 dark:hover:bg-gray-700
          text-left
          transition-colors
          shadow-sm
        "
      >
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {flowchart.name || "Untitled Flowchart"}
        </h3>
      </button>
      <Button onClick={() => handleDeleteFlowchart(flowchart.flowchartId)}>
        Delete
      </Button>
    </div>
  );
};

export default FlowchartLog;
