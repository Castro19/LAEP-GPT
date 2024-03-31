import React, { useEffect, useRef, useState } from "react";

const ChatInput = ({
  msg,
  setMsg,
  msgList,
  setMsgList,
  messagesContainerRef,
}) => {
  const [inputRows, setInputRows] = useState(1);
  const textareaRef = useRef(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setMsg(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (textarea) => {
    const maxHeight = 150; // Max height you want the textarea to grow to
    textarea.style.height = "auto"; // Reset height so scrollHeight includes only text
    const newHeight =
      textarea.scrollHeight > maxHeight ? maxHeight : textarea.scrollHeight;

    textarea.style.height = `${newHeight}px`; // Set new height
    textarea.style.overflowY = newHeight >= maxHeight ? "scroll" : "hidden"; // Show scrollbar only when at max height
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (msg.trim()) {
      const newUserMessage = {
        id: Date.now(),
        sender: "user",
        text: msg,
      };
      setMsgList((prevMessages) => [...prevMessages, newUserMessage]);
      console.log(msgList);
      setMsg("");
      setInputRows(1);
      textareaRef.current.style.height = "auto"; // Replace 40px with the actual initial height
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 0);

      try {
        const response = await fetch("http://localhost:4000/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const newBotMessage = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.botResponse,
        };
        setMsgList((prevMessages) => [...prevMessages, newBotMessage]);
      } catch (error) {
        setError(error.toString());
        console.error(error);
      }
    }
  };

  // ChatInput Component
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 fixed inset-x-0 bottom-0">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          id="ChatInput"
          className="flex-1 resize-none p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 overflow-y-hidden"
          placeholder="Type your message here..."
          rows={inputRows}
          value={msg}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-auto px-4 py-2 bg-blue-500 text-white rounded-tr rounded-br hover:bg-blue-600 dark:hover:bg-blue-400"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
