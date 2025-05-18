import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { FetchedScheduleBuilderLogListItem } from "@polylink/shared/types";
import { useAppDispatch, scheduleBuilderLogActions } from "@/redux";

const ScheduleLogsOptions = ({
  log,
}: {
  log: FetchedScheduleBuilderLogListItem;
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(log.title);

  const dispatch = useAppDispatch();
  // Reset input value when popover is closed without saving
  const handlePopoverClose = () => {
    setInputValue(log.title);
  };

  // Effect to reset input value when log.title changes
  useEffect(() => {
    setInputValue(log.title);
  }, [log.title]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setInputValue(newName);
  };

  const handleUpdateData = () => {
    console.log("Update title:", inputValue);
    dispatch(
      scheduleBuilderLogActions.updateLogTitle({
        threadId: log.thread_id,
        title: inputValue,
      })
    );
    setOpen(false);
  };

  const onDelete = () => {
    console.log("Delete log:", log.thread_id);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) handlePopoverClose();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 dark:hover:bg-transparent flex justify-end transition-transform"
          onClick={() => setOpen(true)}
        >
          <SlOptionsVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4 p-4">
          {/* Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="name">Rename</Label>
            <Input
              id="name"
              defaultValue={log.title}
              onChange={handleNameChange}
            />
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handleUpdateData}>
              Save
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ScheduleLogsOptions;
