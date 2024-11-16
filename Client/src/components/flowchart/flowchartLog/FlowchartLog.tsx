import { useNavigate, useParams } from "react-router-dom";
// Redux
import { useAppSelector, useAppDispatch, messageActions } from "@/redux";
import { FetchAllFlowchartsResponse } from "@/types";
import FlowchartLogOptions from "./FlowchartLogOptions";
import { useState, useEffect } from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

type FlowchartLogProps = {
  flowchart: FetchAllFlowchartsResponse;
  // eslint-disable-next-line no-unused-vars
  onSelectFlowchart: (flowchartId: string) => void;
};

const FlowchartLog = ({ flowchart, onSelectFlowchart }: FlowchartLogProps) => {
  const navigate = useNavigate();
  const { flowchartId } = useParams();
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
    <div className="flex items-center justify-between w-full p-2 cursor-pointer ">
      {/* SidebarMenuButton for the flowchart name */}
      <SidebarMenuButton
        asChild
        onClick={() => handleSelectFlowchart(flowchart.flowchartId)}
        className={`flex-grow text-left ${
          flowchartId === flowchart.flowchartId ? "bg-gray-700" : ""
        }`}
      >
        <span className="font-semibold truncate">{name}</span>
      </SidebarMenuButton>

      {/* Flowchart options */}
      <FlowchartLogOptions
        flowchart={flowchart}
        name={name}
        primaryOption={primaryOption || false}
        onNameChange={setName}
        onPrimaryChange={handlePrimaryChange}
      />
    </div>
  );
};

export default FlowchartLog;
