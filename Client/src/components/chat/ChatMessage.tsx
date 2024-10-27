import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MessageObjType } from "@/types";
import { Button } from "../ui/button";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { useState } from "react";

const md = new MarkdownIt();

type ChatMessageProps = {
  msg: MessageObjType;
};
const ChatMessage = ({ msg }: ChatMessageProps) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  // Boolean Variable to style messages differently between user and chatbot
  const isUserMessage = msg.sender === "user";

  const messageHtml = md.render(msg.text); // Convert Markdown to HTML
  const safeHtml = DOMPurify.sanitize(messageHtml);

  const handleLike = (id: number) => {
    setLiked(true);
    console.log("like", id);
  };
  const handleDislike = (id: number) => {
    setDisliked(true);
    console.log("dislike", id);
  };

  const renderLikeButtons = () => {
    if (!disliked && !liked) {
      return (
        <div className="mt-2 flex justify-end space-x-1">
          <Button variant="ghost" size="sm" onClick={() => handleLike(msg.id)}>
            <FaRegThumbsUp className="w-3 h-3 mr-1" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDislike(msg.id)}
          >
            <FaRegThumbsDown className="w-3 h-3 mr-1" />
          </Button>
        </div>
      );
    } else if (disliked && !liked) {
      return (
        <div className="mt-2 flex justify-end space-x-1">
          <Button variant="ghost" size="sm" disabled>
            <FaRegThumbsDown className="w-3 h-3 mr-1 text-red-500" />
          </Button>
        </div>
      );
    } else if (liked && !disliked) {
      return (
        <div className="mt-2 flex justify-end space-x-1">
          <Button variant="ghost" size="sm" disabled>
            <FaRegThumbsUp className="w-3 h-3 mr-1 text-green-300" />
          </Button>
        </div>
      );
    }
  };
  return (
    <div
      className={`w-full my-4 flex ${
        isUserMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isUserMessage && (
        <div className="pr-2 pt-1">
          <Avatar className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110">
            <AvatarImage
              src={msg.urlPhoto || "/imgs/test.png"}
              alt="Assistant Photo"
            />
          </Avatar>
        </div>
      )}
      <div className="flex flex-col">
        <div
          className={`rounded-lg shadow-lg p-4 ${
            isUserMessage
              ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
              : "bg-gradient-to-r from-gray-800 to-gray-700 text-white dark:from-gray-700 dark:to-gray-600"
          }`}
        >
          <div
            className="prose prose-invert"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </div>
        {!isUserMessage && renderLikeButtons()}
      </div>
    </div>
  );
};

export default ChatMessage;
