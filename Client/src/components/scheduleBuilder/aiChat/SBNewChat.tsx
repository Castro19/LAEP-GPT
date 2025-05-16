import { RiChatNewFill } from "react-icons/ri";
import { onNewScheduleBuilderChat } from "./helpers/newScheduleBuilderChatHandler";
// Redux:
import { useAppDispatch, useAppSelector } from "@/redux";
import { Button } from "@/components/ui/button";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";

const NewChat = () => {
  // Redux:
  const dispatch = useAppDispatch();
  const { currentScheduleChatId, error, isLoading } = useAppSelector(
    (state) => state.scheduleBuilderLog
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={() =>
              onNewScheduleBuilderChat(
                currentScheduleChatId,
                dispatch,
                error,
                isLoading
              )
            }
          >
            <RiChatNewFill className="m-auto w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>New Chat</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NewChat;
