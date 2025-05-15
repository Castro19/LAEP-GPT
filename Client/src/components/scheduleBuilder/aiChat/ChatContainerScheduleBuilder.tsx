import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/redux";
import TurnConversationItem from "./TurnConversationItem";
import BuildScheduleContainer from "../buildSchedule/layout/BuildScheduleContainer";

/* -------------------------------------------------------------------------
   🟥  ChatContainerScheduleBuilder
---------------------------------------------------------------------------*/

const ChatContainerScheduleBuilder: React.FC = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentLog } = useAppSelector((state) => state.scheduleBuilderLog);

  // simple auto‑scroll when component mounts (no live updates yet)
  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
    });
  }, []);

  return (
    <BuildScheduleContainer>
      {/* Message list */}
      <ScrollArea ref={messagesContainerRef} className="flex-1">
        <div className="p-2 mb-16">
          {/* Placeholder bubbles */}
          {currentLog?.conversation_turns.map((turn, index) => (
            <TurnConversationItem
              key={index}
              turn={{
                turn_id: turn.turn_id,
                messages: turn.messages,
              }}
            />
          ))}
        </div>
      </ScrollArea>
    </BuildScheduleContainer>
  );
};

export default ChatContainerScheduleBuilder;
