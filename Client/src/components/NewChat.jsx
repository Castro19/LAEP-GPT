import React from "react";
import { RiChatNewFill } from "react-icons/ri";
import createNewChatLogId from "../utils/handleNewChat";
import { useMessage } from "./contexts/MessageContext";
import { useUI } from "./contexts/UIContext";

const NewChat = () => {
  const { setMsgList } = useMessage();
  const { setIsNewChat, setCurrentChatId } = useUI();

  const toggleNewChat = () => {
    createNewChatLogId(setCurrentChatId, setIsNewChat, setMsgList);
  };
  return (
    <button onClick={toggleNewChat} className="text-lg">
      <RiChatNewFill />
    </button>
  );
};

export default NewChat;
