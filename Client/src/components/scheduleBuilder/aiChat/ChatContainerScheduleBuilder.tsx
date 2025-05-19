import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux";
import TurnConversationItem from "./TurnConversationItem";

import { ConversationTurn } from "@polylink/shared/types/scheduleBuilderLog";
import BuildScheduleAIChatContainer from "./BuildScheduleAIChatContainer";

/* -------------------------------------------------------------------------
   🟥  ChatContainerScheduleBuilder
---------------------------------------------------------------------------*/

const ChatContainerScheduleBuilder: React.FC = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentLog } = useAppSelector((state) => state.scheduleBuilderLog);
  const isUserAtBottomRef = useRef(true);

  const [msgList, setMsgList] = useState<ConversationTurn[]>([]);
  useEffect(() => {
    if (currentLog) {
      const { conversation_turns } = currentLog;
      console.log("New messages received:", conversation_turns.length);
      setMsgList(conversation_turns);
    }
  }, [currentLog]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) {
      console.log("No messages container found");
      return;
    }

    // Find the ScrollArea viewport
    const viewport = messagesContainer.closest(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) {
      console.log("No ScrollArea viewport found");
      return;
    }

    console.log("Initial scroll check");
    isUserAtBottomRef.current = checkIfUserAtBottom(viewport);

    const handleScroll = () => {
      const wasAtBottom = isUserAtBottomRef.current;
      isUserAtBottomRef.current = checkIfUserAtBottom(viewport);
      console.log(
        "Scroll event - was at bottom:",
        wasAtBottom,
        "now at bottom:",
        isUserAtBottomRef.current
      );
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) {
      console.log("No messages container found for auto-scroll");
      return;
    }

    // Find the ScrollArea viewport
    const viewport = messagesContainer.closest(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) {
      console.log("No ScrollArea viewport found for auto-scroll");
      return;
    }

    console.log(
      "Auto-scroll check - isUserAtBottom:",
      isUserAtBottomRef.current,
      "msgList length:",
      msgList.length
    );
    if (isUserAtBottomRef.current || msgList.length <= 1) {
      console.log("Attempting to scroll to bottom");
      setTimeout(() => {
        const { scrollHeight, clientHeight } = viewport;
        console.log(
          "Scroll dimensions - height:",
          scrollHeight,
          "client height:",
          clientHeight
        );
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [msgList]);

  const checkIfUserAtBottom = (viewport: Element) => {
    if (!viewport) {
      console.log("No viewport found for bottom check");
      return true;
    }

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 60;
    console.log(
      "Bottom check - scrollTop:",
      scrollTop,
      "scrollHeight:",
      scrollHeight,
      "clientHeight:",
      clientHeight,
      "isAtBottom:",
      isAtBottom
    );
    return isAtBottom;
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
