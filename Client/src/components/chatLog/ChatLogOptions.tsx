import React, { useState } from "react";
import {
  logActions,
  messageActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { LogListType } from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";

const ChatLogOptions = ({
  log,
  name,
  onNameChange,
}: {
  log: LogListType;
  name: string;
  // eslint-disable-next-line no-unused-vars
  onNameChange: (name: string) => void;
}) => {
  const { userId } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false); 

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    onNameChange(newName);
  };

  const isDeleting = useAppSelector((state) =>
    state.log.deletingLogIds.includes(log.logId)
  );

  const onDelete = () => {
    if (isDeleting) return; // Prevent multiple deletion attempts
    try {
      if (userId) {
        dispatch(logActions.deleteLog({ logId: log.logId }))
          .unwrap()
          .then(() => {
            navigate(`/chat`);
            dispatch(messageActions.resetMsgList(log.logId));
            dispatch(messageActions.toggleNewChat(true));
            dispatch(messageActions.setCurrentChatId(null));
            setOpen(false); 
          })
          .catch((error) => {
            if (environment === "dev") {
              console.error(`Error trying to delete log ${log.logId}: `, error);
            }
          });
      }
    } catch (error) {
      if (environment === "dev") {
        console.error(`Error trying to delete log ${log.logId}: `, error);
      }
    }
  };

  const handleUpdateData = async () => {
    try {
      await dispatch(
        logActions.updateLogTitle({
          logId: log.logId,
          title: name,
        })
      ).unwrap();

      setOpen(false);
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to update chat log:", error);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 dark:hover:bg-transparent flex justify-end transition-transform hover:scale-125 "
          onClick={() => setOpen(true)}
        >
          <SlOptionsVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4 p-4">
          {/* Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="name">Modify Chat Log</Label>
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

export default ChatLogOptions;
