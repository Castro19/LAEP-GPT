import React from "react";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = new MarkdownIt();

const ChatMessage = ({ msg }) => {
  const isUserMessage = msg.sender === "user";
  const messageHtml = md.render(msg.text); // Convert Markdown to HTML
  const safeHtml = DOMPurify.sanitize(messageHtml);

  return (
    <div
      className={`w-full my-2 flex ${
        isUserMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-2/3 ${
          isUserMessage
            ? "bg-blue-600 text-white" // User messages: Blue background with white text.
            : "bg-gray-800 dark:bg-gray-700 text-white" // Bot messages: Darker background with white text for better contrast.
        } rounded-lg shadow p-4`}
      >
        <div
          className="prose prose-invert"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
    </div>
  );
};

export default ChatMessage;
