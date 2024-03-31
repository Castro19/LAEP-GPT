import React, { useEffect } from "react";
import "./App.css";
import ChatContainer from "./components/chat/ChatContainer";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <>
      <ChatContainer />
    </>
  );
}

export default App;
