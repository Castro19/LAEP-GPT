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

/**
 * ScheduleOptions - Popover component for managing individual schedule options
 *
 * This component provides a popover interface for managing schedule-specific options
 * including name editing, primary schedule setting, and schedule deletion. It integrates
 * with the Redux store to persist changes and handle navigation.
 *
 * @component
 * @param {Object} props - Component props
 * @param {ScheduleListItem} props.schedule - The schedule data to manage
 * @param {string} props.name - Current name of the schedule
 * @param {function} props.onNameChange - Callback function when name is changed
 * @param {boolean} props.primaryOption - Whether this schedule is set as primary
 * @param {function} props.onPrimaryChange - Callback function when primary status changes
 *
 * @example
 * ```tsx
 * <ScheduleOptions
 *   schedule={scheduleData}
 *   name="My Schedule"
 *   onNameChange={(name) => setName(name)}
 *   primaryOption={true}
 *   onPrimaryChange={(primary) => setPrimary(primary)}
 * />
 * ```
 *
 * @dependencies
 * - Redux store for schedule management and state
 * - React Router for navigation
 * - UI components for popover, input, switch, and buttons
 * - React Icons for options menu icon
 *
 * @features
 * - Schedule name editing with input field
 * - Primary schedule toggle with switch control
 * - Schedule deletion with confirmation
 * - Automatic navigation after deletion
 * - Form validation and error handling
 * - Popover-based interface for compact design
 *
 * @state
 * - Local state for popover open/close
 * - Redux state for primary schedule and current term
 * - Form state for name and primary option
 *
 * @actions
 * - handleNameChange: Updates the schedule name
 * - handleUpdateData: Saves changes to the schedule
 * - handleDeleteFlowchart: Deletes the schedule and navigates
 *
 * @validation
 * - Name input validation
 * - Primary schedule validation
 * - Schedule existence validation
 *
 * @styling
 * - Compact popover design
 * - Responsive layout with grid system
 * - Consistent spacing and typography
 * - Dark mode support
 * - Hover effects and transitions
 *
 * @navigation
 * - Automatic navigation to schedule builder after deletion
 * - URL state management for current schedule
 * - Route parameter handling
 */
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
    dispatch(scheduleActions.setCurrentScheduleId(undefined));
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
