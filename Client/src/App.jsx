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

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <>
      <Header modelType={modelType} setModelType={setModelType} />
      <ChatContainer modelType={modelType} />
    </>
  );
}

export default App;
