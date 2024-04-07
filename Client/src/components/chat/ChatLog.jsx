import React from "react";

const ChatLog = ({ log, onSelectLog }) => {
  // Assuming useMessage and useUI contexts are correctly set up and utilized here
  return (
    <button
      onClick={() => onSelectLog(log.id)}
      className="
          block
          w-full
          px-4 py-2
          my-1 mx-0
          cursor-pointer
          rounded-lg
          bg-gray-100 dark:bg-gray-800
          hover:bg-blue-100 dark:hover:bg-gray-700
          text-left
          transition-colors
          shadow-sm
        "
    >
      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
        {log.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {new Date(log.timestamp).toLocaleString()}
      </p>
    </button>
  );
};

export default ChatLog;
