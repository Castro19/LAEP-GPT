import React from "react";

const ChatMessage = ({ msg }) => {
  const isUserMessage = msg.sender === "user";

  return (
    <div
      className={`w-full my-2 flex ${
        isUserMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-2/3 rounded-lg shadow ${
          isUserMessage
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
        }`}
      >
        <div className="p-2">
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              isUserMessage
                ? "text-blue-200"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {msg.sender}:
          </span>
          <p className="text-sm mt-1">{msg.text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
