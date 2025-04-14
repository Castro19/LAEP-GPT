import { NewChat } from "@/components/chat";
import { ChatContainer } from "@/components/chat";

const CalendarAIChatContainer = () => {
  return (
    <>
      <header className="sticky top-0 bg-slate-900 text-white p-1 z-40 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
        <div className="flex items-center justify-end">
          <NewChat />
        </div>
      </header>
      <ChatContainer />
    </>
  );
};

export default CalendarAIChatContainer;
