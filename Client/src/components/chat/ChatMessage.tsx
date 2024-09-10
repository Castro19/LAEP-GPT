import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MessageObjType } from "@/types";

const md = new MarkdownIt();

type ChatMessageProps = {
  msg: MessageObjType;
};
const ChatMessage = ({ msg }: ChatMessageProps) => {
  // Boolean Variable to style messages differently between user and chatbot
  const isUserMessage = msg.sender === "user";

  const messageHtml = md.render(msg.text); // Convert Markdown to HTML
  const safeHtml = DOMPurify.sanitize(messageHtml);

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
      <div
        className={`rounded-lg shadow-lg p-4 ${
          isUserMessage
            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white " // User messages: Blue background with white text.
            : "bg-gradient-to-r from-gray-800 to-gray-700 text-white dark:from-gray-700 dark:to-gray-600 mb-8" // Bot messages: Darker background with white text for better contrast.
        } `}
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
