import React from "react";
import { RiChatNewFill } from "react-icons/ri";

// Redux:
import { useSelector, useDispatch } from "react-redux";
import { toggleNewChat as toggleReduxNewChat } from "../../redux/layout/layoutSlice";
import { resetMsgList as resetReduxMsgList } from "../../redux/chat/messageSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const NewChat = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  // Redux:
  const dispatch = useDispatch();
  const currentMsgList = useSelector((state) => state.message.msgList);

  const toggleNewChat = () => {
    if (currentMsgList.length > 0) {
      dispatch(resetReduxMsgList()); // Reset the MsgList
      dispatch(toggleReduxNewChat(true)); // Flag indicating it's a new chat
      navigate(`/${userId}`);
    }
  };

  return (
    <button onClick={toggleNewChat} className="text-lg">
      <RiChatNewFill />
    </button>
  );
};

export default NewChat;
