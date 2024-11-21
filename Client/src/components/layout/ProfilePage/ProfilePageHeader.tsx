import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

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
          className="absolute left-4 text-lg hover:text-gray-300"
        >
          <IoIosArrowBack />
        </button>
        <h1 className="self-center text-lg font-bold">Edit Profile</h1>
      </div>
    </header>
  );
};

export default ChatHeader;
