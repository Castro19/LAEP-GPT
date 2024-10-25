import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
// React Redux
import { useAppDispatch, useAppSelector } from "@/redux";
import { messageActions, logActions } from "@/redux";
// Helpers
import {
  adjustTextareaHeight,
  resetInputAndScrollToBottom,
} from "./helpers/formatHelper";
import { v4 as uuidv4 } from "uuid";

type ChatInputProps = {
  messagesContainerRef: React.RefObject<HTMLDivElement>;
};

const ChatInput = ({ messagesContainerRef }: ChatInputProps) => {
  const dispatch = useAppDispatch();

  const currentModel = useAppSelector((state) => state.gpt.currentModel);
  const { isNewChat, currentChatId, currentFile, error } = useAppSelector(
    (state) => state.message
  );
  const userId = useAppSelector((state) => state.auth.userId);

  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsg(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSending(true);

    setMsg("");
    resetInputAndScrollToBottom(textareaRef, messagesContainerRef);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    // Generate a new unique chatId
    const newLogId = uuidv4();

    if (error) {
      dispatch(messageActions.clearError()); // Clear error when user starts typing
    }
    try {
      await dispatch(
        messageActions.fetchBotResponse({
          currentModel,
          file: currentFile, //add pdf file
          msg,
          currentChatId: isNewChat ? newLogId : currentChatId,
          userId: userId ? userId : "",
        })
      ).unwrap();
      dispatch(messageActions.setCurrentFile(null)); // Clear file in Redux
      if (isNewChat) {
        dispatch(messageActions.setCurrentChatId(newLogId));
        navigate(`/${userId}/chat/${newLogId}`);
        dispatch(messageActions.toggleNewChat(false));
        dispatch(
          logActions.addLog({
            msg: msg,
            modelType: currentModel.title,
            id: newLogId,
            firebaseUserId: userId ? userId : null,
          })
        );
      } else {
        if (currentChatId) {
          dispatch(
            logActions.updateLog({
              logId: currentChatId,
              firebaseUserId: userId ? userId : null,
              urlPhoto: currentModel.urlPhoto,
            })
          );
        }
      }
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  //add function to handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      messageActions.setCurrentFile(e.target.files ? e.target.files[0] : null)
    ); // Use Redux action
  };

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 sticky bottom-0">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {msg.length > 1500 && (
        <div className="text-yellow-500 text-sm">
          You have reached {msg.length} of 2000 characters.
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        />
        <textarea
          ref={textareaRef}
          id="ChatInput"
          className="flex-1 resize-none p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 overflow-y-hidden"
          placeholder="Type your message here..."
          rows={1}
          value={msg}
          maxLength={2000}
          onChange={handleInputChange}
        />
        <button className="p-[3px] relative" disabled={isSending}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-lg" />
          <div
            className={`px-8 py-2 bg-zinc-900 rounded-[6px] relative group transition duration-200 text-white ${
              isSending
                ? "bg-gray-400 cursor-not-allowed flex justify-center"
                : "hover:bg-transparent"
            }`}
          >
            {isSending ? <FaSpinner className="animate-spin" /> : "Send"}
          </div>
        </button>
      </form>
    </div>
  );
};
export default ChatInput;
