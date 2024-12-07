import { useNavigate, useParams } from "react-router-dom";
// Redux
import { useAppSelector, useAppDispatch, messageActions } from "@/redux";
import { FetchFlowchartResponse } from "@polylink/shared/types";
import FlowchartLogOptions from "./FlowchartLogOptions";
import { useState, useEffect } from "react";
import { SidebarMenuButton, SidebarMenuSubItem } from "@/components/ui/sidebar";

type FlowchartLogProps = {
  flowchart: FetchFlowchartResponse;
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
    <SidebarMenuSubItem className="w-full border-b border-sidebar-border">
      <div className="group flex items-center justify-between px-2 py-2.5 mb-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 w-full">
        {/* SidebarMenuButton for the flowchart name */}
        <SidebarMenuButton
          asChild
          onClick={() => handleSelectFlowchart(flowchart.flowchartId)}
          className={`flex-1 flex items-center gap-3 cursor-pointer ${
            flowchart.primaryOption
              ? "border-yellow-600 border-2" // Primary flowchart style
              : "border-gray-600"
          } bg-slate-800 rounded-md transition duration-200 ease-in-out transform hover:bg-slate-700 hover:scale-105 ${
            flowchartId === flowchart.flowchartId ? "bg-slate-600" : ""
          }`}
        >
          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold truncate ${
                flowchart.primaryOption ? "text-yellow-500" : "text-white"
              }`}
            >
              {flowchart.primaryOption && "★ "}
              {name}
            </h3>
          </div>
        </SidebarMenuButton>
        {/* Flowchart options */}
        <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <FlowchartLogOptions
            flowchart={flowchart}
            name={name}
            primaryOption={primaryOption || false}
            onNameChange={setName}
            onPrimaryChange={handlePrimaryChange}
          />
        </div>
      </div>
    </SidebarMenuSubItem>
  );
};

export default FlowchartLog;
