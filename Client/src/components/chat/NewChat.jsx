import React from "react";
import { useNavigate } from "react-router-dom";
import { RiChatNewFill } from "react-icons/ri";

// User Auth Context
import { useAuth } from "../../contexts/authContext";

// Redux:
import { useSelector, useDispatch } from "react-redux";
import { toggleNewChat } from "../../redux/layout/layoutSlice";
import { resetMsgList } from "../../redux/chat/messageSlice";
import { clearError } from "../../redux/chat/messageSlice";

const NewChat = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  // Redux:
  const dispatch = useDispatch();
  const currentMsgList = useSelector((state) => state.message.msgList);
  const error = useSelector((state) => state.message.error); // Access the error state from Redux

  const onNewChat = () => {
    if (currentMsgList.length > 0) {
      dispatch(resetMsgList()); // Reset the MsgList
      dispatch(toggleNewChat(true)); // Flag indicating it's a new chat
      if (error) {
        dispatch(clearError()); // Clear error when user starts typing
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
