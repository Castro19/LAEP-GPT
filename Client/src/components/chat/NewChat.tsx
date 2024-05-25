import { useNavigate } from "react-router-dom";
import { RiChatNewFill } from "react-icons/ri";

// User Auth Context
import { useAuth } from "../../contexts/authContext";

// Redux:
import { useAppDispatch, useAppSelector } from "@/redux";
import { messageActions } from "@/redux";

const NewChat = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  // Redux:
  const dispatch = useAppDispatch();
  const currentMsgList = useAppSelector((state) => state.message.msgList);

  const error = useAppSelector((state) => state.message.error); // Access the error state from Redux

  const onNewChat = () => {
    if (currentMsgList.length > 0) {
      dispatch(messageActions.resetMsgList()); // Reset the MsgList
      dispatch(messageActions.toggleNewChat(true)); // Flag indicating it's a new chat
      if (error) {
        dispatch(messageActions.clearError()); // Clear error when user starts typing
      }
      navigate(`/${userId}`);
    }
  };

  return (
    <button onClick={onNewChat} className="text-lg hover:text-gray-300">
      <RiChatNewFill />
    </button>
  );
};

export default NewChat;
