import { useAppSelector } from "@/redux";
import { FetchedFlowchartObject } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { GoPin } from "react-icons/go";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { flowchartActions, useAppDispatch } from "@/redux";
import { useUserData } from "@/hooks/useUserData";
import { environment } from "@/helpers/getEnvironmentVars";
import { UserData } from "@polylink/shared/types";

const SavedFlowchartList = () => {
  const { flowchartList } = useAppSelector((state) => state.flowchart);
  return (
    <div>
      <div className="flex flex-col items-start justify-start gap-2">
        {flowchartList && flowchartList.length > 0 ? (
          flowchartList.map((flowchart: FetchedFlowchartObject) => (
            <FlowchartItem
              key={flowchart.flowchartId}
              flowchart={flowchart}
              isPrimary={flowchart.primaryOption || false}
            />
          ))
        ) : (
          <div className="p-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            Press the{" "}
            <strong className="text-slate-400 font-semibold">
              New Flowchart
            </strong>{" "}
            button to create a flowchart
          </div>
        )}
      </div>
    </div>
  );
};

const FlowchartItem = ({
  flowchart,
  isPrimary,
}: {
  flowchart: FetchedFlowchartObject;
  isPrimary: boolean;
}) => {
  const [name, setName] = useState(flowchart.name);
  const [primaryOption, setPrimaryOption] = useState(isPrimary);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleSave, handleChangeFlowchartInformation } = useUserData();
  const flowchartList = useAppSelector(
    (state) => state.flowchart.flowchartList
  );

  const handleSelectFlowchart = () => {
    dispatch(flowchartActions.setFlowchart(flowchart.flowchartId));
    dispatch(flowchartActions.setCreateFlowchart(false));
    navigate(`/flowchart/${flowchart.flowchartId}`);
  };

  useEffect(() => {
    if (isPrimary) {
      setPrimaryOption(true);
    }
  }, [isPrimary]);

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
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
    <div className="group flex items-center justify-between px-2 py-2 mb-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 w-full border-b border-gray-200 dark:border-gray-700">
      <Button
        onClick={handleSelectFlowchart}
        className={`group w-full p-1 sm:p-2 rounded-md`}
        variant="ghost"
      >
        {isPrimary && <GoPin className="dark:text-red-500 mr-1" size={14} />}

        <div className="flex-1 min-w-0 flex flex-col items-start justify-start gap-0.5 p-1 sm:p-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
            {flowchart.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {new Date().toLocaleString(undefined, {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </Button>
      <div
        className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="flex justify-end m-0 p-0 w-4">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
              <SlOptionsVertical size={14} />
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
                  onCheckedChange={setPrimaryOption}
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
      </div>
    </div>
  );
};

export default SavedFlowchartList;
