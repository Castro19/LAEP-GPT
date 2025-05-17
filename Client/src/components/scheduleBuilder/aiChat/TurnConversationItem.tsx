import React from "react";
import SBChatMessage, { SBMessage, ToolMsg } from "./SBChatMessage";

/* --------------------------------------------------------------------
   Types coming from backend (simplified)
----------------------------------------------------------------------*/
export interface BackendMsg {
  msg_id: string;
  role: "user" | "assistant" | "tool";
  msg: string;
  tool_calls?: any[] | null;
  // ...other fields omitted for layout only
}

export interface BackendTurn {
  turn_id: string;
  messages: BackendMsg[];
  // ...token usage etc.
}

/* --------------------------------------------------------------------
   Helper — reshape backend messages to props for SBChatMessage
----------------------------------------------------------------------*/
/*  TurnConversationItem.tsx  – only the helper changed  */
const buildProps = (messages: BackendMsg[]) => {
  // first message ↔︎ user • last message ↔︎ final assistant reply
  const userRaw = messages[0];
  const assistantRaw = messages[messages.length - 1];

  // ── NEW  — gather all assistant messages that contain tool_calls
  const assistantCalls = messages
    .filter((m) => m.role === "assistant" && Array.isArray(m.tool_calls))
    .flatMap((m) => m.tool_calls ?? []);

  // all tool messages between first & last assistant
  const toolMsgs: ToolMsg[] = messages
    .filter((m) => m.role === "tool")
    .map((m) => ({ msg_id: m.msg_id, msg: m.msg }));

  const user: SBMessage = {
    msg_id: userRaw.msg_id,
    role: "user",
    msg: userRaw.msg,
  };

  const assistant: SBMessage = {
    msg_id: assistantRaw.msg_id,
    role: "assistant",
    msg: assistantRaw.msg,
    tool_calls: assistantCalls, // ← now populated
    toolMessages: toolMsgs,
  };

  return { user, assistant };
};

/* --------------------------------------------------------------------
   Component — shows exactly two bubbles (user + assistant)
----------------------------------------------------------------------*/
interface Props {
  turn: BackendTurn;
}

const TurnConversationItem: React.FC<Props> = ({ turn }) => {
  const { user, assistant } = buildProps(turn.messages);

  return (
    <div className="w-full flex flex-col gap-2 py-2">
      {turn.messages.length === 1 ? (
        <SBChatMessage msg={user} />
      ) : (
        <>
          <SBChatMessage msg={user} />
          <SBChatMessage msg={assistant} />
        </>
      )}
    </div>
  );
};

export default TurnConversationItem;
