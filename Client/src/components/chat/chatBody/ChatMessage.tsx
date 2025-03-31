import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MessageObjType } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import useTrackAnalytics from "@/hooks/useTrackAnalytics";
import { putUserReaction } from "@/redux/message/messageSlice";
import { useAppDispatch, useAppSelector } from "@/redux";

import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import ChatLoadingMessage from "./ChatLoadingMessage";

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
  const isNarrowScreen = useIsNarrowScreen();
  const isUserMessage = msg.sender === "user";

  // Convert Markdown to HTML and sanitize
  const messageHtml = md.render(msg.text);
  const safeHtml = DOMPurify.sanitize(messageHtml, {
    ADD_ATTR: ["target", "rel"],
  });

  const isScreenWidthSmall =
    isNarrowScreen ||
    location.pathname.includes("/section") ||
    location.pathname.includes("/calendar");

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
          {msg?.thinkingState || msg?.toolUsage ? (
            <ChatLoadingMessage toolUsage={msg?.toolUsage || null} />
          ) : (
            !isScreenWidthSmall && (
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
      {!msg?.thinkingState && !msg?.toolUsage && (
        <div
          className={`flex flex-col ${
            isScreenWidthSmall ? "max-w-[100%]" : "max-w-[75%]"
          }`}
        >
          <div
            className={`rounded-lg shadow-lg px-2 py-4 ${
              isUserMessage
                ? "mr-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
                : "bg-gradient-to-r from-gray-800 to-gray-700 text-white dark:from-gray-700 dark:to-gray-600"
            }`}
          >
            <div
              className="prose prose-invert weekly-planner-tables"
              style={{ maxWidth: "100%" }}
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            ></div>
          </div>
          {!isUserMessage && renderLikeButtons()}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
