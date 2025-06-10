/**
 * @component ChatLogOptions
 * @description Options menu for chat logs, providing rename and delete functionality.
 * Manages the UI for modifying chat log properties.
 *
 * @props
 * @prop {string} id - Chat log ID
 * @prop {string} title - Current chat title
 * @prop {Function} onClose - Function to close options menu
 *
 * @features
 * - Rename chat title
 * - Delete chat log
 * - Confirmation dialogs
 * - Error handling
 *
 * @dependencies
 * - Redux: For log management
 * - UI Components: Dialog, Input
 *
 * @behavior
 * - Handles title renaming
 * - Manages deletion process
 * - Shows confirmation dialogs
 * - Updates Redux state
 *
 * @related
 * Redux: Client/src/redux/log/logSlice.ts
 * - updateLogTitle: Updates chat title
 * - deleteLog: Removes chat log
 */

import { useState, useEffect } from "react";
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

const ChatLogOptions = ({ log }: { log: LogListType }) => {
  const { userId } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(log.title);

  // Reset input value when popover is closed without saving
  const handlePopoverClose = () => {
    setInputValue(log.title);
  };

  // Effect to reset input value when log.title changes
  useEffect(() => {
    setInputValue(log.title);
  }, [log.title]);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setInputValue(newName);
  };
  const handleUpdateData = async () => {
    try {
      await dispatch(
        logActions.updateLogTitle({
          logId: log.logId,
          title: inputValue || "",
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
          className="w-6 dark:hover:bg-transparent flex justify-end transition-transform "
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

export default ChatLogOptions;
