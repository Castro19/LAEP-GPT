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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg.trim()) {
      const newUserMessage = {
        id: Date.now(),
        sender: "user2",
        text: msg,
      };
      setMsgList([...msgList, newUserMessage]);
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
    }
  };

  // ChatInput Component
  return (
    <div className="w-full p-4 bg-white fixed inset-x-0 bottom-0">
      <form onSubmit={handleSubmit} className="flex items-start">
        <textarea
          ref={textareaRef}
          id="ChatInput"
          className="flex-1 resize-none p-2 border rounded-tl rounded-bl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out bg-gray-100"
          placeholder="Type your message here..."
          rows={inputRows}
          value={msg}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-auto px-4 py-2 bg-blue-500 text-white rounded-tr rounded-br hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
