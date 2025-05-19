import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux";
import TurnConversationItem from "./TurnConversationItem";

import { ConversationTurn } from "@polylink/shared/types/scheduleBuilderLog";
import BuildScheduleAIChatContainer from "./BuildScheduleAIChatContainer";

/* -------------------------------------------------------------------------
   🟥  ChatContainerScheduleBuilder
---------------------------------------------------------------------------*/

const BOTTOM_THRESHOLD = 60; // pixels from bottom to consider "at bottom"

const findScrollAreaViewport = (
  container: HTMLElement | null
): Element | null => {
  if (!container) return null;
  return container.closest("[data-radix-scroll-area-viewport]");
};

const ChatContainerScheduleBuilder: React.FC = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentLog } = useAppSelector((state) => state.scheduleBuilderLog);
  const isUserAtBottomRef = useRef(true);

  const [msgList, setMsgList] = useState<ConversationTurn[]>([]);
  useEffect(() => {
    if (currentLog) {
      const { conversation_turns } = currentLog;
      if (process.env.NODE_ENV !== "production") {
        console.log("New messages received:", conversation_turns.length);
      }
      setMsgList(conversation_turns);
    }
  }, [currentLog]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    const viewport = findScrollAreaViewport(messagesContainer);
    if (!viewport) return;

    isUserAtBottomRef.current = checkIfUserAtBottom(viewport);

    const handleScroll = () => {
      isUserAtBottomRef.current = checkIfUserAtBottom(viewport);
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    const viewport = findScrollAreaViewport(messagesContainer);
    if (!viewport) return;

    if (isUserAtBottomRef.current || msgList.length <= 1) {
      setTimeout(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [msgList]);

  const checkIfUserAtBottom = (viewport: Element) => {
    if (!viewport) return true;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    return Math.abs(scrollHeight - clientHeight - scrollTop) < BOTTOM_THRESHOLD;
  };

  return (
    <BuildScheduleAIChatContainer ref={messagesContainerRef}>
      <div className="p-2">
        {/* Placeholder bubbles */}
        {msgList.map((turn, index) => (
          <TurnConversationItem
            key={index}
            turn={{
              turn_id: turn.turn_id,
              messages: turn.messages,
            }}
          />
        ))}
      </div>
    </BuildScheduleAIChatContainer>
  );
};

export default ChatContainerScheduleBuilder;
