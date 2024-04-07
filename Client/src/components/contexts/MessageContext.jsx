import React, { useState, useContext, createContext } from "react";
const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [msg, setMsg] = useState("");

  const [msgList, setMsgList] = useState([]);

  const [logList, setLogList] = useState([]);

  return (
    <MessageContext.Provider
      value={{
        msg,
        setMsg,
        msgList,
        setMsgList,
        logList,
        setLogList,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
