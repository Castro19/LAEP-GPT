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
import { useSidebar } from "../ui/sidebar";

const md = new MarkdownIt();

// Remember the old renderer
const defaultLinkRenderer =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

// Override link_open rule to add target and rel attributes using attrSet()
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet("target", "_blank");
  tokens[idx].attrSet("rel", "noopener noreferrer");
  // Return the default renderer
  return defaultLinkRenderer(tokens, idx, options, env, self);
};

type ChatMessageProps = {
  msg: MessageObjType;
};

const ChatMessage = ({ msg }: ChatMessageProps) => {
  const dispatch = useAppDispatch();
  const { currentChatId } = useAppSelector((state) => state.message);
  const { trackUserReaction } = useTrackAnalytics();
  const { isMobile } = useSidebar();
  const isUserMessage = msg.sender === "user";

  // Convert Markdown to HTML and sanitize
  const messageHtml = md.render(msg.text);
  const safeHtml = DOMPurify.sanitize(messageHtml, {
    ADD_ATTR: ["target", "rel"],
  });

  const handleLike = (id: string) => {
    if (currentChatId) {
      dispatch(
        putUserReaction({
          logId: currentChatId,
          botMessageId: id,
          userReaction: "like",
        })
      );
      trackUserReaction({ botMessageId: id, userReaction: "like" });
    }
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
      trackUserReaction({ botMessageId: id, userReaction: "dislike" });
    }
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
        <div className="pt-1">
          {msg?.thinkingState ? (
            <div className="flex items-center space-x-4 mb-12">
              <Skeleton className="h-16 w-16 rounded-full dark:bg-slate-600/50" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] dark:bg-slate-600/50" />
                <Skeleton className="h-4 w-[200px] dark:bg-slate-600/50" />
              </div>
            </div>
          ) : (
            !isMobile && (
              <Avatar className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-110 mr-2">
                <AvatarImage
                  src={msg.urlPhoto || "/imgs/test.png"}
                  alt="Assistant Photo"
                />
              </Avatar>
            )
          )}
        </div>
      )}
      {!msg?.thinkingState && (
        <div className="flex flex-col">
          <div
            className={`rounded-lg shadow-lg px-2 py-4 ${
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
