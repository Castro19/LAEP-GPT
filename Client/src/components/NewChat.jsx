import React from "react";
import { RiChatNewFill } from "react-icons/ri";

const toggleNewChat = () => window.location.reload();

const NewChat = () => {
  return (
    <button onClick={toggleNewChat} className="text-lg">
      <RiChatNewFill />
    </button>
  );
};

export default NewChat;
