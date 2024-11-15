import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/useUserData";
import { useNavigate } from "react-router-dom";
import { FetchAllFlowchartsResponse } from "@/types";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import { setFlowchart } from "@/redux/flowchart/flowchartSlice";

const FlowchartLogOptions = ({
  flowchart,
  name,
  onNameChange,
  primaryOption,
  onPrimaryChange,
}: {
  flowchart: FetchAllFlowchartsResponse;
  name: string;
  // eslint-disable-next-line no-unused-vars
  onNameChange: (name: string) => void;
  primaryOption: boolean;
  // eslint-disable-next-line no-unused-vars
  onPrimaryChange: (primaryOption: boolean) => void;
}) => {
  const { handleSave, handleChange } = useUserData();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const flowchartList = useAppSelector(
    (state) => state.flowchart.flowchartList
  );

  // Update name change handler
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    onNameChange(newName);
  };

  const handleUpdateData = async () => {
    try {
      const flowchartData = await dispatch(
        setFlowchart(flowchart.flowchartId)
      ).unwrap();
      await dispatch(
        flowchartActions.updateFlowchart({
          flowchartId: flowchart.flowchartId,
          name: name,
          flowchartData: flowchartData,
          primaryOption: primaryOption ?? false,
        })
      ).unwrap();
      navigate(`/flowchart/${flowchart.flowchartId}`);
    } catch (error) {
      console.error("Failed to update flowchart:", error);
    }
  };

  const handleDeleteFlowchart = async (flowchartId: string) => {
    await dispatch(flowchartActions.deleteFlowchart(flowchartId));
    dispatch(flowchartActions.resetFlowchartData());
    // Set the flowchartId to the next flowchart in the list
    const nextFlowchartId = flowchartList?.[0]?.flowchartId;
    dispatch(flowchartActions.setFlowchart(nextFlowchartId ?? ""));
    handleChange("flowchartId", "");
    handleSave();
    navigate("/flowchart");
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="dark:bg-transparent" variant="ghost" size="icon">
          <SlOptionsVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" flex items-center justify-center fixed top-0 left-0">
        <div className="grid gap-4 bg-background p-4 rounded-lg w-[300px]">
          <div className="grid gap-2 w-auto">
            {/* Name */}
            <Label htmlFor="name">Modify Name</Label>
            <Input
              id="name"
              defaultValue={flowchart.name}
              onChange={handleNameChange}
            />
            {/* Delete */}
            <Label htmlFor="delete"></Label>
            {/* Set as Primary */}
            <Label htmlFor="primary">Set as Primary</Label>
            <Switch
              id="primary"
              checked={primaryOption}
              onCheckedChange={(checked) => onPrimaryChange(checked)}
            />
            {/* Save */}
            <Button variant="secondary" onClick={handleUpdateData}>
              Save
            </Button>
            {/* Delete */}
            <Button
              variant="destructive"
              onClick={() => handleDeleteFlowchart(flowchart.flowchartId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FlowchartLogOptions;
