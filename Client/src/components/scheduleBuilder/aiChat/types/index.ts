import { ConversationTurn } from "@polylink/shared/types/scheduleBuilderLog";

export interface ChatContainerProps {
  sendButtonRef: React.RefObject<HTMLButtonElement>;
}

export interface ScheduleBuilderAIChatProps {
  currentHeight: number;
  sendButtonRef: React.RefObject<HTMLButtonElement>;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export interface TurnConversationItemProps {
  turn: {
    turn_id: string;
    messages: ConversationTurn["messages"];
  };
}

export interface ChatInputProps {
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  sendButtonRef: React.RefObject<HTMLButtonElement>;
}

export interface SuggestedMessagesProps {
  sendButtonRef: React.RefObject<HTMLButtonElement>;
}
