import React, { useState } from "react";
import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate } from "react-router-dom";

import { useUserData } from "@/hooks/useUserData";
import { FetchedFlowchartObject, UserData } from "@polylink/shared/types";

// env vars
import { environment } from "@/helpers/getEnvironmentVars";

// UI Components
import { SlOptionsVertical } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  flowchart: FetchedFlowchartObject;
  name: string;
  // eslint-disable-next-line no-unused-vars
  onNameChange: (name: string) => void;
  primaryOption: boolean;
  // eslint-disable-next-line no-unused-vars
  onPrimaryChange: (primaryOption: boolean) => void;
}) => {
  const { handleSave, handleChangeFlowchartInformation } = useUserData();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const flowchartList = useAppSelector(
    (state) => state.flowchart.flowchartList
  );

  // Popover state
  const [open, setOpen] = useState(false);

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    onNameChange(newName);
  };

  // Update flowchart data and close popover after saving
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

      // Navigate to the updated flowchart page
      navigate(`/flowchart/${flowchart.flowchartId}`);

      if (primaryOption) {
        handleChangeFlowchartInformation("flowchartId", flowchart.flowchartId);
        handleSave();
      }

      // Show success toast
      toast({
        title: "Flowchart Updated",
        description: "Your flowchart has been updated successfully.",
      });

      // Close the popover
      setOpen(false);
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to update flowchart:", error);
      }
    }
  };

  // Delete flowchart and close popover after deleting
  const handleDeleteFlowchart = async (flowchartId: string) => {
    // Step 1: Delete the flowchart from the database
    await dispatch(
      flowchartActions.deleteFlowchart({
        flowchartId,
        handleChange: (name, value) =>
          handleChangeFlowchartInformation(
            name as keyof UserData["flowchartInformation"],
            value
          ),
      })
    ).unwrap();

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
      dispatch(
        flowchartActions.setCurrentFlowchart({} as FetchedFlowchartObject)
      );
      handleChangeFlowchartInformation("flowchartId", "");
      // Step 5: Navigate to the flowchart list
      navigate("/flowchart");
    }
    // Step 6: Handle save operation
    toast({
      title: "Flowchart Deleted",
      description: "Your flowchart has been deleted successfully.",
    });
    // Close the popover
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="flex justify-end m-0 p-0 w-4">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
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
              disabled={flowchart.primaryOption}
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
