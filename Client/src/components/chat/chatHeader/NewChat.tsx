/**
 * @component NewChat
 * @description Button component for starting a new chat session. Resets the chat state
 * and prepares for a new conversation with the current assistant.
 *
 * @props
 * None - Uses Redux state for chat management
 *
 * @features
 * - Resets current chat state
 * - Clears message history
 * - Returns to new chat view
 * - Maintains current assistant selection
 *
 * @dependencies
 * - Redux: message and log actions
 * - React Router: For navigation
 *
 * @behavior
 * - Resets chat state in Redux
 * - Clears current chat ID
 * - Toggles new chat state
 * - Navigates to chat home
 *
 * @related
 * Redux: Client/src/redux/message/messageSlice.ts
 * - resetMsgList: Clears message history
 * - toggleNewChat: Sets new chat state
 * - setCurrentChatId: Resets chat ID
 */

import { useNavigate } from "react-router-dom";
import { RiChatNewFill } from "react-icons/ri";
import { onNewChat } from "../helpers/newChatHandler";
// Redux:
import { useAppDispatch, useAppSelector } from "@/redux";
import { Button } from "../../ui/button";
import { TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Tooltip } from "../../ui/tooltip";
import { TooltipProvider } from "../../ui/tooltip";
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
                messagesByChatId,
                location.pathname.includes("/schedule-builder")
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
