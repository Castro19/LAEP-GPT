import React from "react";
import { archiveChatSession } from "../../utils/createLog";

const ChatLog = ({ msgList, setMsgList, logList, setLogList }) => {
  const handleLog = () => {
    archiveChatSession(msgList, logList, setLogList);

    console.log("LOGS: ", logList);
  };
  return (
    <button onClick={handleLog}>
      {logList.length > 0 ? logList[0].title : "..."}
    </button>
  );
};

export default ChatLog;
