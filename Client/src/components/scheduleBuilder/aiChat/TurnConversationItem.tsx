import React from "react";
import SBChatMessage, { SBMessage, ToolMsg } from "./SBChatMessage";

/* --------------------------------------------------------------------
   Types coming from backend (simplified)
----------------------------------------------------------------------*/
export interface BackendMsg {
  msg_id: string;
  role: "user" | "assistant" | "tool";
  msg: string;
  tool_calls?: ToolCall[] | null;
  toolMessages?: ToolMsg[] | null;
  tools?: Tool[];
  // ...other fields omitted for layout only
}

export interface BackendTurn {
  turn_id: string;
  messages: BackendMsg[];
  // ...token usage etc.
}

interface ToolCall {
  id: string;
  name: string;
  args: any;
  type: string;
}

interface Tool {
  call: ToolCall;
  message: ToolMsg;
}

/* --------------------------------------------------------------------
   Helper — reshape backend messages to props for SBChatMessage
----------------------------------------------------------------------*/
const buildProps = (messages: BackendMsg[]) => {
  // the user is always the first
  const userRaw = messages[0];

  // collect every assistant‐role object
  const assistantMsgs = messages.filter((m) => m.role === "assistant");
  // the real "final" assistant bubble is the last one
  const assistantRaw = assistantMsgs[assistantMsgs.length - 1];

  // --- gather all the agent's tool_call payloads and their corresponding tool messages ---
  const tools: Tool[] = [];
  let currentToolCall: ToolCall | null = null;

  messages.forEach((m) => {
    if (m.role === "assistant" && m.tool_calls) {
      currentToolCall = m.tool_calls[0]; // Assuming one tool call per assistant message
    } else if (m.role === "tool" && currentToolCall) {
      tools.push({
        call: currentToolCall,
        message: { msg_id: m.msg_id, msg: m.msg },
      });
      currentToolCall = null;
    }
  });

  const user: SBMessage = {
    msg_id: userRaw.msg_id,
    role: "user",
    msg: userRaw.msg,
  };

  // If the assistant message already has tools in the new format, use those
  // Otherwise, use the tools we collected or the old format
  const assistant: SBMessage = {
    msg_id: assistantRaw.msg_id,
    role: "assistant",
    msg: assistantRaw.msg,
    ...(assistantRaw.tools
      ? { tools: assistantRaw.tools }
      : tools.length > 0
        ? { tools }
        : {
            tool_calls: assistantRaw.tool_calls || [],
            toolMessages: assistantRaw.toolMessages || [],
          }),
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
