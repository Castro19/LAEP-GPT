// Chat Layout Components
export { default as ChatContainer } from "./chatBody/ChatContainer";
export { default as ChatMessage } from "./chatBody/ChatMessage";
export { default as AssistantSuggestedMessages } from "./chatBody/AssistantSuggestedMessages";

// Chat Header Components
export { default as NewChat } from "./chatHeader/NewChat";
export { default as ModeDropDown } from "./chatHeader/ModeDropDown";

// Chat Footer Components
export { default as ChatInput } from "./chatFooter/ChatInput";

// Utilities and Helpers
export { onNewChat } from "./helpers/newChatHandler";
export {
  adjustTextareaHeight,
  resetInputAndScrollToBottom,
} from "./helpers/formatHelper";
