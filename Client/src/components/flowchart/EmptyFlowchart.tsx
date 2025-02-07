import FlowChartOptions from "../register/SignInFlow/FlowChartOptions";
import { AnimatedModalDemo } from "../layout/CustomModal";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux";
import { fetchFlowchartDataHelper } from "@/redux/flowchart/api-flowchart";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";

const EmptyFlowchart = () => {
  const { selections } = useAppSelector((state) => state.flowSelection);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const handleSaveFlowchart = () => {
    if (selections.catalog && selections.major && selections.concentration) {
      fetchFlowchartDataHelper(
        dispatch,
        selections.catalog,
        selections.major,
        selections.concentration.code
      );
      navigate("/flowchart");
    } else {
      toast({
        title: "Please select a catalog and major",
        description:
          "You must select a catalog and major to create a flowchart",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="text-2xl font-bold">kjcsakfjn</h1>
      <div className="flex flex-col gap-4 p -4">
        <FlowChartOptions type="flowchart" />
        <Button onClick={handleSaveFlowchart}>Generate Flowchart</Button>
      </div>
    </div>
  );
};

export default EmptyFlowchart;

/*
Look at AnimatedModak



*/
