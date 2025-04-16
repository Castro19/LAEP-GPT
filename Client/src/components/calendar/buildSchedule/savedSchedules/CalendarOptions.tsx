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
import { Calendar, CalendarListItem } from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";
import { scheduleActions, useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate } from "react-router-dom";

const CalendarOptions = ({
  calendar,
  name,
  onNameChange,
  primaryOption,
  onPrimaryChange,
}: {
  calendar: CalendarListItem;
  name: string;
  // eslint-disable-next-line no-unused-vars
  onNameChange: (name: string) => void;
  primaryOption: boolean;
  // eslint-disable-next-line no-unused-vars
  onPrimaryChange: (primaryOption: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { primaryCalendarId } = useAppSelector((state) => state.schedule);
  // Popover state
  const [open, setOpen] = useState(false);

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    onNameChange(newName);
  };

  // Update flowchart data and close popover after saving
  const handleUpdateData = async () => {
    const updatedSchedule = {
      schedule: calendar,
      name: name,
      primaryCalendarId: primaryOption ? calendar.id : primaryCalendarId,
    } as {
      schedule: Calendar;
      name: string;
      primaryCalendarId: string;
    };
    if (environment === "dev") {
      console.log("UPDATED CALENDAR", updatedSchedule);
    }

    dispatch(scheduleActions.updateScheduleAsync(updatedSchedule));

    setOpen(false);
  };

  // Delete flowchart and close popover after deleting
  const handleDeleteFlowchart = async (calendarId: string) => {
    if (environment === "dev") {
      console.log("DELETING CALENDAR", calendarId);
    }
    // Close the popover
    dispatch(scheduleActions.removeScheduleAsync(calendarId));
    setOpen(false);
    navigate("/calendar");
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
              defaultValue={calendar.name}
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
              onClick={() => handleDeleteFlowchart(calendar.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarOptions;
