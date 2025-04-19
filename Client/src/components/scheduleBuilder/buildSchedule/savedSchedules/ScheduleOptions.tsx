import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import { ScheduleListItem } from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";
import { scheduleActions, useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate } from "react-router-dom";

const ScheduleOptions = ({
  schedule,
  name,
  onNameChange,
  primaryOption,
  onPrimaryChange,
}: {
  schedule: ScheduleListItem;
  name: string;
  // eslint-disable-next-line no-unused-vars
  onNameChange: (name: string) => void;
  primaryOption: boolean;
  // eslint-disable-next-line no-unused-vars
  onPrimaryChange: (primaryOption: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { primaryScheduleId, currentScheduleTerm } = useAppSelector(
    (state) => state.schedule
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
    const isPrimary = primaryOption ? schedule.id : primaryScheduleId;
    const updatedSchedule = {
      schedule: schedule,
      name: name,
      primaryScheduleId: isPrimary,
    } as {
      schedule: ScheduleListItem;
      name: string;
      primaryScheduleId: string;
    };
    if (environment === "dev") {
      console.log("UPDATED SCHEDULE", updatedSchedule);
    }

    dispatch(
      scheduleActions.updateScheduleAsync({
        schedule: updatedSchedule.schedule,
        primaryScheduleId: isPrimary,
        name: updatedSchedule.name,
        term: currentScheduleTerm,
      })
    );

    setOpen(false);
  };

  // Delete flowchart and close popover after deleting
  const handleDeleteFlowchart = async (scheduleId: string) => {
    if (environment === "dev") {
      console.log("DELETING SCHEDULE", scheduleId);
    }
    // Close the popover
    dispatch(
      scheduleActions.removeScheduleAsync({
        scheduleId,
        term: currentScheduleTerm,
      })
    );
    setOpen(false);
    navigate("/schedule-builder");
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
              defaultValue={schedule.name}
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
              disabled={primaryOption}
            />
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleUpdateData()}>
              Save
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteFlowchart(schedule.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ScheduleOptions;
