import React from "react";
import { RiChatNewFill } from "react-icons/ri";
import createNewChatLogId from "../utils/handleNewChat";
import { useMessage } from "./contexts/MessageContext";
import { useUI } from "./contexts/UIContext";
import { archiveChatSession } from "../utils/createLog";

const NewChat = () => {
  const { msgList, setMsgList, logList, setLogList } = useMessage();
  const { currentChatId, setCurrentChatId, setIsNewChat } = useUI();

  const toggleNewChat = () => {
    archiveChatSession(msgList, currentChatId, logList, setLogList);
    createNewChatLogId(setCurrentChatId, setIsNewChat, setMsgList);
  };
  return (
    <button onClick={toggleNewChat} className="text-lg">
      <RiChatNewFill />
    </button>
  );
};

export default NewChat;
