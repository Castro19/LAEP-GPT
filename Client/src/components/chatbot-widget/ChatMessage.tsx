import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          isUser
            ? "bg-indigo-700 text-white"
            : "bg-slate-700 text-slate-100 border border-slate-600/50"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
