// Scroll behavior constants
export const SCROLL = {
  BOTTOM_THRESHOLD: 20, // pixels from bottom to consider "at bottom"
  SCROLL_AREA_SELECTOR: "[data-radix-scroll-area-viewport]",
} as const;

// Layout constants
export const LAYOUT = {
  CHAT_INPUT_HEIGHT: "h-20",
  CHAT_INPUT_BG: "bg-slate-900",
} as const;

// Component class names
export const CLASSES = {
  CHAT_CONTAINER: "h-full flex flex-col",
  MESSAGES_CONTAINER: "p-2 h-full",
  EMPTY_STATE: "flex items-center justify-center text-slate-400",
} as const;
