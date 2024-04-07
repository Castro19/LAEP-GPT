import React, { useState, useEffect } from "react";
import "./App.css";
import ChatContainer from "./components/chat/ChatContainer";
import Header from "./components/Header";
import { UIProvider } from "./components/contexts/UIContext";
import { MessageProvider } from "./components/contexts/MessageContext";
import { ModelProvider } from "./components/contexts/ModelContext";

function App() {
  // Set The Model type for the ChatBot, 3 versions:
  // Normal Mode('normal'),
  // Senior Project Ethical Advisor('Ethical'),
  // Advisor Matching ('match')

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <>
      <UIProvider>
        <MessageProvider>
          <ModelProvider>
            <Header />
            <ChatContainer />
          </ModelProvider>
        </MessageProvider>
      </UIProvider>
    </>
  );
}

export default App;
