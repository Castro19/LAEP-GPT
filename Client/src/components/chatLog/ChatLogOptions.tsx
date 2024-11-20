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
import { LogData } from "@/types";

const ChatLogOptions = ({
  log,
  name,
  onNameChange,
}: {
  log: LogData;
  name: string;
  // eslint-disable-next-line no-unused-vars
  onNameChange: (name: string) => void;
}) => {
  const { userId } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Update name change handler
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    onNameChange(newName);
  };

  const isDeleting = useAppSelector((state) =>
    state.log.deletingLogIds.includes(log.id)
  );

  const onDelete = () => {
    if (isDeleting) return; // Prevent multiple deletion attempts
    try {
      if (userId) {
        dispatch(logActions.deleteLog({ logId: log.id }))
          .unwrap()
          .then(() => {
            navigate(`/chat`);
            dispatch(messageActions.resetMsgList());
            dispatch(messageActions.toggleNewChat(true));
          })
          .catch((error) =>
            console.error(`Error trying to delete log ${log.id}: `, error)
          );
      }
    } catch (error) {
      console.error(`Error trying to delete log ${log.id}: `, error);
    }
  };

  const handleUpdateData = async () => {
    try {
      await dispatch(
        logActions.updateLogTitle({
          logId: log.id,
          title: name,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update chat log:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="flex justify-start">
          <SlOptionsVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4 p-4">
          {/* Name */}
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