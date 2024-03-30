import React from "react";

const ChatMessage = ({ msg }) => {
  const isUserMessage = msg.sender === "user";

  return (
    <div
      className={`w-full my-2 rounded-lg ${
        isUserMessage ? "bg-gray-500 text-white" : "bg-gray-300 text-gray-800"
      }`}
    >
      <div className="p-2">
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            isUserMessage ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {msg.sender}:
        </span>
        <p className="text-sm mt-1">{msg.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
