import { useNavigate } from "react-router-dom";
import { RiChatNewFill } from "react-icons/ri";
import { onNewChat } from "./helpers/newChatHandler";
// Redux:
import { useAppDispatch, useAppSelector } from "@/redux";
import { Button } from "../ui/button";
import { TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Tooltip } from "../ui/tooltip";
import { TooltipProvider } from "../ui/tooltip";
const NewChat = () => {
  const navigate = useNavigate();
  // Redux:
  const dispatch = useAppDispatch();
  const { currentChatId, error, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={() =>
              onNewChat(
                currentChatId,
                dispatch,
                navigate,
                error,
                loading,
                messagesByChatId
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
