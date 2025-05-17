import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux";
import TurnConversationItem from "./TurnConversationItem";

/* -------------------------------------------------------------------------
  ⚠️  Stub‑only layout
  Replace ContextBarStub, MessageBubbleStub, PendingBubbleStub, and ComposerStub
  with real components when they are implemented. The layout, refs, and basic
  Tailwind styling are in place so you can swap‑in live logic later without
  touching this wrapper.
---------------------------------------------------------------------------*/

const ContextBarStub = () => (
  <div className="border-b px-4 py-2 flex items-center gap-2 bg-slate-800">
    <Badge variant="secondary" className="opacity-60 pointer-events-none">
      context‑chip
    </Badge>
    <div className="flex-1 h-8 rounded-md bg-slate-700/60" />
  </div>
);

const PendingBubbleStub = () => (
  <div className="mr-auto max-w-[80%] bg-muted rounded-2xl p-3 flex items-center gap-2">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span className="text-sm italic opacity-70">Thinking…</span>
  </div>
);

const ComposerStub = () => (
  <form
    onSubmit={(e) => e.preventDefault()}
    className="border-t px-4 py-2 flex gap-2 bg-slate-800"
  >
    <Textarea
      readOnly
      value=""
      placeholder="Ask the schedule builder…"
      className="flex-1 resize-none"
      rows={1}
    />
    <Button disabled>Send</Button>
  </form>
);

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
    <Card className="flex flex-col h-[calc(100vh-3rem)] w-full rounded-none bg-slate-900 border-l border-slate-800">
      {/* Context / preferences bar */}
      <ContextBarStub />

      {/* Message list */}
      <ScrollArea ref={messagesContainerRef} className="flex-1">
        <div className="p-4 space-y-2">
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
          <PendingBubbleStub />
        </div>
      </ScrollArea>

      {/* Composer */}
      <ComposerStub />
    </Card>
  );
};

export default ChatContainerScheduleBuilder;
