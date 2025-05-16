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
  toolMessages?: ToolMsg[] | null;
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
  // the user is always the first
  const userRaw = messages[0];

  // collect every assistant‐role object
  const assistantMsgs = messages.filter((m) => m.role === "assistant");
  // the real “final” assistant bubble is the last one
  const assistantRaw = assistantMsgs[assistantMsgs.length - 1];

  // --- gather all the agent’s tool_call payloads (if any) ---
  // those come back in assistant.tool_calls
  const assistantCalls = assistantMsgs.flatMap((m) => m.tool_calls ?? []);

  // --- gather all tool‐role messages in this turn ---
  const gatheredToolMsgs: ToolMsg[] = messages
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
    tool_calls: assistantCalls, // for any function‐call metadata
    toolMessages: assistantRaw.toolMessages || gatheredToolMsgs, // for any “tool”‐role result bubbles
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
  console.log("turn", turn);
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
