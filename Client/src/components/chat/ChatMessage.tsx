import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MessageObjType } from "@polylink/shared/types";
import { Button } from "../ui/button";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import useTrackAnalytics from "@/hooks/useTrackAnalytics";
import { putUserReaction } from "@/redux/message/messageSlice";
import { useAppDispatch, useAppSelector } from "@/redux";
import { Skeleton } from "@/components/ui/skeleton";

const md = new MarkdownIt();

type ChatMessageProps = {
  msg: MessageObjType;
};
const ChatMessage = ({ msg }: ChatMessageProps) => {
  const dispatch = useAppDispatch();
  const { currentChatId } = useAppSelector((state) => state.message);
  const { trackUserReaction } = useTrackAnalytics();
  // Boolean Variable to style messages differently between user and chatbot
  const isUserMessage = msg.sender === "user";

  const messageHtml = md.render(msg.text); // Convert Markdown to HTML
  const safeHtml = DOMPurify.sanitize(messageHtml);

  const handleLike = (id: string) => {
    if (currentChatId) {
      dispatch(
        putUserReaction({
          logId: currentChatId,
          botMessageId: id,
          userReaction: "like",
        })
      );
      trackUserReaction({
        botMessageId: id,
        userReaction: "like",
      });
    }
    // Send the like to the backend
  };
  const handleDislike = (id: string) => {
    if (currentChatId) {
      dispatch(
        putUserReaction({
          logId: currentChatId,
          botMessageId: id,
          userReaction: "dislike",
        })
      );
      trackUserReaction({
        botMessageId: id,
        userReaction: "dislike",
      });
    }
    // Send the dislike to the backend
  };

  const renderLikeButtons = () => {
    if (msg.userReaction === null) {
      return (
        <div className="mt-2 flex justify-end space-x-1 mb-7">
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
    } else if (msg.userReaction === "dislike") {
      return (
        <div className="mt-2 flex justify-end space-x-1 mb-7">
          <Button variant="ghost" size="sm" disabled>
            <FaRegThumbsDown className="w-3 h-3 mr-1 text-red-500" />
          </Button>
        </div>
      );
    } else if (msg.userReaction === "like") {
      return (
        <div className="mt-2 flex justify-end space-x-1 mb-7">
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
          {msg?.thinkingState ? (
            <div className="flex items-center space-x-4 mb-12">
              <Skeleton className="h-16 w-16 rounded-full dark:bg-slate-600/50" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] dark:bg-slate-600/50" />
                <Skeleton className="h-4 w-[200px] dark:bg-slate-600/50" />
              </div>
            </div>
          ) : (
            <Avatar className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110">
              <AvatarImage
                src={msg.urlPhoto || "/imgs/test.png"}
                alt="Assistant Photo"
              />
            </Avatar>
          )}
        </div>
      )}
      {!msg?.thinkingState && (
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
      )}
    </div>
  );
};

export default ChatMessage;
