import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ChatHeader = () => {
  const navigate = useNavigate();
  const handleBackToChat = () => {
    // Map back to the previous page
    navigate("/chat");
  };

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-x-gray-500 shadow-md">
      <div className="flex items-center justify-center">
        <button
          onClick={handleBackToChat}
          className="absolute left-4 text-lg hover:bg-transparent"
        >
          <ChevronLeft className="w-5 h-5 transition-transform duration-200 hover:-translate-x-1 size-10" />
        </button>
        <h1 className="self-center text-lg font-bold">Edit Profile</h1>
      </div>
    </header>
  );
};

export default ChatHeader;
