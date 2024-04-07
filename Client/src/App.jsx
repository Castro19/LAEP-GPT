import React, { useState, useEffect } from "react";
import "./App.css";
import ChatContainer from "./components/chat/ChatContainer";
import Header from "./components/Header";

function App() {
  // Set The Model type for the ChatBot, 3 versions:
  // Normal Mode('normal'),
  // Senior Project Ethical Advisor('Ethical'),
  // Advisor Matching ('match')
  const [modelType, setModelType] = useState("normal");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [logList, setLogList] = useState([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [msgList, setMsgList] = useState([]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <>
      <Header
        msgList={msgList}
        setMsgList={setMsgList}
        modelType={modelType}
        setModelType={setModelType}
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        logList={logList}
        setLogList={setLogList}
      />
      <ChatContainer
        msgList={msgList}
        setMsgList={setMsgList}
        logList={logList}
        setLogList={setLogList}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        modelType={modelType}
      />
    </>
  );
}

export default App;
