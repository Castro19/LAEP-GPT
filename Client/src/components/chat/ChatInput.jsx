import React, { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa"; // Example using React Icons

import sendMessage from "../../utils/handleMessage";
import {
  adjustTextareaHeight,
  resetInputAndScrollToBottom,
} from "../../utils/format";

const ChatInput = ({
  modelType,
  msg,
  setMsg,
  setMsgList,
  messagesContainerRef,
}) => {
  const textareaRef = useRef(null);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  // Modify the Message State variable and automatically change the height of the input text area
  const handleInputChange = (e) => {
    setMsg(e.target.value);
    // Find this f'n in src/utils/format
    adjustTextareaHeight(e.target);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    // Resetting the message will clear the message in the text area b4 async call f'n returns
    // Will still pass the user's message correctly to `sendMessage`
    setMsg("");

    // We want to use this helper function to scroll to the bottom of the message container (in case of long messages) and resize the text area.
    resetInputAndScrollToBottom(textareaRef, messagesContainerRef);

    try {
      // Find this function in src/utils/handleMessage.js
      // This makes the API request and handles the response
      await sendMessage(modelType, msg, setMsgList, setError);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      // Re-enable button always after promise resolves, whether it fails or suceeds.
      setIsSending(false);
    }
  };

  // ChatInput Component:
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 fixed inset-x-0 bottom-0">
      {msg.length > 1500 && (
        <div className="text-yellow-500 text-sm">
          You have reached {msg.length} of 2000 characters.
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          id="ChatInput"
          className="flex-1 resize-none p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 overflow-y-hidden"
          placeholder="Type your message here..."
          rows={1}
          value={msg}
          maxLength="2000"
          onChange={handleInputChange}
        />
        <button
          type="submit"
          disabled={isSending}
          className={`w-auto px-4 py-2 text-white rounded-tr rounded-br ${
            isSending
              ? "bg-gray-400 cursor-not-allowed flex justify-center"
              : "bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400"
          }`}
        >
          {isSending ? <FaSpinner className="animate-spin" /> : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
