import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux";
// Types
import { ConversationTurn } from "@polylink/shared/types/scheduleBuilderLog";
// My components:
import {
  TurnConversationItem,
  SBAssistantSuggestedMessages,
} from "@/components/scheduleBuilder/aiChat";

/**
 * ChatContainerScheduleBuilder - Container component for managing chat messages and scroll behavior
 *
 * This component manages the display of conversation turns, handles scroll behavior,
 * and provides empty state with suggested messages. It automatically scrolls to new
 * messages while respecting user scroll position.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.RefObject<HTMLButtonElement>} props.sendButtonRef - Reference to the send button for suggested messages
 *
 * @example
 * ```tsx
 * <ChatContainerScheduleBuilder sendButtonRef={sendButtonRef} />
 * ```
 *
 * @dependencies
 * - Redux store for schedule builder log state
 * - TurnConversationItem for individual message display
 * - SBAssistantSuggestedMessages for empty state
 * - Scroll area viewport detection utilities
 *
 * @features
 * - Automatic message list management from Redux state
 * - Smart scroll behavior that respects user position
 * - Empty state with suggested messages
 * - Scroll position tracking and restoration
 * - First message handling for initial scroll
 *
 * @scrollBehavior
 * - Tracks if user is at bottom of scroll area
 * - Only auto-scrolls when user is at bottom or first message
 * - Uses threshold-based detection (20px from bottom)
 * - Handles scroll area viewport detection
 *
 * @state
 * - Local state for message list
 * - Ref-based tracking of scroll position
 * - First message flag for initial behavior
 * - Redux state for current log and conversation turns
 *
 * @utilities
 * - findScrollAreaViewport: Locates scroll area viewport element
 * - checkIfUserAtBottom: Determines if user is near bottom of scroll area
 * - BOTTOM_THRESHOLD: Configurable threshold for bottom detection
 *
 * @styling
 * - Proper padding and height management
 * - Empty state centering
 * - Responsive design considerations
 */
/* -------------------------------------------------------------------------
   🟥  ChatContainerScheduleBuilder
---------------------------------------------------------------------------*/

const BOTTOM_THRESHOLD = 20; // pixels from bottom to consider "at bottom"

const findScrollAreaViewport = (
  container: HTMLElement | null
): Element | null => {
  if (!container) return null;
  return container.closest("[data-radix-scroll-area-viewport]");
};

const ChatContainerScheduleBuilder: React.FC<{
  sendButtonRef: React.RefObject<HTMLButtonElement>;
}> = ({ sendButtonRef }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentLog } = useAppSelector((state) => state.scheduleBuilderLog);
  const isUserAtBottomRef = useRef(true);
  const isFirstMessageRef = useRef(true);

  const [msgList, setMsgList] = useState<ConversationTurn[]>([]);
  const isEmpty = !currentLog || currentLog.conversation_turns.length === 0;

  useEffect(() => {
    if (currentLog) {
      const { conversation_turns } = currentLog;
      setMsgList(conversation_turns);
      // Reset first message flag when we get a new log
      isFirstMessageRef.current = conversation_turns.length === 0;
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

    // Only scroll if we have messages and user is at bottom
    if (!isEmpty && (isUserAtBottomRef.current || isFirstMessageRef.current)) {
      viewport.scrollTop = viewport.scrollHeight;
      // After first message is complete, set flag to false
      if (isFirstMessageRef.current && msgList.length > 0) {
        isFirstMessageRef.current = false;
      }
    }
  }, [msgList, isEmpty]);

  const checkIfUserAtBottom = (viewport: Element) => {
    if (!viewport) return true;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    return Math.abs(scrollHeight - clientHeight - scrollTop) < BOTTOM_THRESHOLD;
  };

  return (
    <div ref={messagesContainerRef} className="p-2 h-full">
      {!isEmpty ? (
        msgList.map((turn, index) => (
          <TurnConversationItem
            key={index}
            turn={{
              turn_id: turn.turn_id,
              messages: turn.messages,
            }}
          />
        ))
      ) : (
        <div className="flex items-center justify-center text-slate-400">
          <SBAssistantSuggestedMessages sendButtonRef={sendButtonRef} />
        </div>
      )}
    </div>
  );
};

export default ChatContainerScheduleBuilder;
