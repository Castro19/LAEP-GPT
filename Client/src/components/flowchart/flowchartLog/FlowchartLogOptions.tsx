import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/useUserData";
import { useNavigate } from "react-router-dom";
import { FetchFlowchartResponse } from "@/types";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const FlowchartLogOptions = ({
  flowchart,
  name,
  onNameChange,
  primaryOption,
  onPrimaryChange,
}: {
  flowchart: FetchFlowchartResponse;
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
      await dispatch(
        flowchartActions.updateFlowchart({
          flowchartId: flowchart.flowchartId,
          name: name,
          flowchartData: null,
          primaryOption: primaryOption ?? false,
        })
      ).unwrap();
      navigate(`/flowchart/${flowchart.flowchartId}`);
      if (primaryOption) {
        handleChange("flowchartId", flowchart.flowchartId);
        handleSave();
      }
      toast({
        title: "Flowchart Updated",
        description: "Your flowchart has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update flowchart:", error);
    }
  };

  const handleDeleteFlowchart = async (flowchartId: string) => {
    // Step 1: Delete the flowchart from the database
    await dispatch(flowchartActions.deleteFlowchart(flowchartId));
    // Step 2: Reset the flowchart data
    dispatch(flowchartActions.resetFlowchartData());
    // Step 3: Determine the next flowchart to set
    const nextFlowchartId = flowchartList?.find(
      (fc) => fc.flowchartId !== flowchartId
    )?.flowchartId;
    if (nextFlowchartId) {
      // If there is a next flowchart, set it as the active one
      dispatch(flowchartActions.setFlowchart(nextFlowchartId));
      // Step 5: Navigate to the next flowchart
      navigate(`/flowchart/${nextFlowchartId}`);
    } else {
      // Step 5: Navigate to the flowchart list
      navigate("/flowchart");
    }
    if (primaryOption) {
      // Step 6: Update primary option if necessary
      handleChange("flowchartId", "");
      handleSave();
    }
    // Step 7: Handle save operation
    toast({
      title: "Flowchart Deleted",
      description: "Your flowchart has been deleted successfully.",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <SlOptionsVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4 p-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Modify Name</Label>
            <Input
              id="name"
              defaultValue={flowchart.name}
              onChange={handleNameChange}
            />
          </div>
          {/* Set as Primary */}
          <div className="flex items-center justify-between">
            <Label htmlFor="primary">Set as Primary</Label>
            <Switch
              id="primary"
              checked={primaryOption}
              onCheckedChange={onPrimaryChange}
            />
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handleUpdateData}>
              Save
            </Button>
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
