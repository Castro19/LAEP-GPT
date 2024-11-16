import { AnimatedModalDemo } from "@/components/layout/CustomModal";
import FlowChartOptions from "@/components/register/SignInFlow/FlowChartOptions";
import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { fetchFlowchartDataHelper } from "@/redux/flowchart/api-flowchart";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const CreateFlowchartModal = ({
  skipHandleChange = false,
}: {
  skipHandleChange?: boolean;
}) => {
  const flowchartDropdownRef = useRef<HTMLDivElement>(null);
  const { selections } = useAppSelector((state) => state.flowchart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCreateFlowchart = () => {
    if (selections.catalog && selections.major && selections.concentration) {
      fetchFlowchartDataHelper(
        dispatch,
        selections.catalog,
        selections.major,
        selections.concentration
      );
      navigate("/flowchart");
    } else {
      toast({
        title: "Please select a catalog, major, and concentration",
        description: "Please select a catalog, major, and concentration",
        variant: "destructive",
      });
    }
  };
  return (
    <AnimatedModalDemo
      title="Create New Flowchart"
      onSave={handleCreateFlowchart}
      excludeRefs={[flowchartDropdownRef]}
    >
      <FlowChartOptions
        dropdownRef={flowchartDropdownRef}
        skipHandleChange={skipHandleChange}
      />
    </AnimatedModalDemo>
  );
};

export default CreateFlowchartModal;