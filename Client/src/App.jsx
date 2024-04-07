import React from "react";
import "./App.css";
import ChatContainer from "./components/chat/ChatContainer";
import Header from "./components/Header";
import { UIProvider } from "./components/contexts/UIContext";
import { MessageProvider } from "./components/contexts/MessageContext";
import { ModelProvider } from "./components/contexts/ModelContext";

function App() {
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
