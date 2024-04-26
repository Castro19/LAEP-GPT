import React from "react";
import "./App.css";
import ChatContainer from "./components/chat/ChatContainer";
import ChatHeader from "./components/layouts/Header";

function App() {
  return (
    <div>
      <ChatHeader />
      <ChatContainer />
    </div>
  );
}

export default App;
