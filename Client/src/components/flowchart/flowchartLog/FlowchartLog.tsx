import { useNavigate } from "react-router-dom";
// Redux
import { useAppSelector, useAppDispatch, messageActions } from "@/redux";
import { FetchAllFlowchartsResponse } from "@/types";
import FlowchartLogOptions from "./FlowchartLogOptions";
import { useState, useEffect } from "react";

type FlowchartLogProps = {
  flowchart: FetchAllFlowchartsResponse;
  // eslint-disable-next-line no-unused-vars
  onSelectFlowchart: (flowchartId: string) => void;
};

const FlowchartLog = ({ flowchart, onSelectFlowchart }: FlowchartLogProps) => {
  const navigate = useNavigate();
  // Redux:
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.message.error);
  const flowchartList = useAppSelector(
    (state) => state.flowchart.flowchartList
  );
  const [name, setName] = useState(flowchart.name);
  const [primaryOption, setPrimaryOption] = useState(flowchart.primaryOption);

  useEffect(() => {
    const updatedFlowchart = flowchartList?.find(
      (f) => f.flowchartId === flowchart.flowchartId
    );
    if (updatedFlowchart) {
      setPrimaryOption(updatedFlowchart.primaryOption);
    }
  }, [flowchartList, flowchart.flowchartId]);

  const handleSelectFlowchart = async (flowchartId: string) => {
    onSelectFlowchart(flowchartId);
    navigate(`/flowchart/${flowchartId}`);
    if (error) {
      dispatch(messageActions.clearError());
    }
  };

  const handlePrimaryChange = (primaryOption: boolean) => {
    setPrimaryOption(primaryOption);
  };

  return (
    <div className="flex align-center justify-between mb-1 pb-1 border-b border-gray-500 dark:border-gray-700">
      <FlowchartLogOptions
        flowchart={flowchart}
        name={name}
        primaryOption={primaryOption || false}
        onNameChange={setName}
        onPrimaryChange={handlePrimaryChange}
      />
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
          {name || "Untitled Flowchart"}
        </h3>
      </button>
    </div>
  );
};

export default FlowchartLog;
