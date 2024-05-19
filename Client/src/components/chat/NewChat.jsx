import React from "react";
import { RiChatNewFill } from "react-icons/ri";

// Redux:
import { useSelector, useDispatch } from "react-redux";
import { toggleNewChat as toggleReduxNewChat } from "../../redux/layout/layoutSlice";
import { resetMsgList as resetReduxMsgList } from "../../redux/chat/messageSlice";
import { clearError } from "../../redux/chat/messageSlice";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const NewChat = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  // Redux:
  const dispatch = useDispatch();
  const currentMsgList = useSelector((state) => state.message.msgList);
  const error = useSelector((state) => state.message.error); // Access the error state from Redux

  const toggleNewChat = () => {
    if (currentMsgList.length > 0) {
      dispatch(resetReduxMsgList()); // Reset the MsgList
      dispatch(toggleReduxNewChat(true)); // Flag indicating it's a new chat
      if (error) {
        dispatch(clearError()); // Clear error when user starts typing
      }
      navigate(`/${userId}`);
    }
  };

  return (
    <button onClick={toggleNewChat} className="text-lg hover:text-gray-300">
      <RiChatNewFill />
    </button>
  );
};

export default NewChat;
