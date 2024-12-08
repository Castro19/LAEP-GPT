import { useNavigate } from "react-router-dom";
import { RiChatNewFill } from "react-icons/ri";
import { onNewChat } from "./helpers/newChatHandler";
// Redux:
import { useAppDispatch, useAppSelector } from "@/redux";

const NewChat = () => {
  const navigate = useNavigate();
  // Redux:
  const dispatch = useAppDispatch();
  const currentMsgList = useAppSelector((state) => state.message.msgList);

  const error = useAppSelector((state) => state.message.error); // Access the error state from Redux

  return (
    <button
      onClick={() => onNewChat(currentMsgList, dispatch, navigate, error)}
      className="text-lg hover:text-gray-300"
    >
      <RiChatNewFill />
    </button>
  );
};

export default NewChat;
