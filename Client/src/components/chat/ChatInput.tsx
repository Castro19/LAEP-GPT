import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { Loader2 } from "lucide-react";

import { FileUpload } from "../ui/file-upload";
// React Redux
import { useAppDispatch, useAppSelector } from "@/redux";
import { messageActions, logActions } from "@/redux";
// Helpers
import {
  adjustTextareaHeight,
  resetInputAndScrollToBottom,
} from "./helpers/formatHelper";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import useTrackAnalytics from "@/hooks/useTrackAnalytics";

type ChatInputProps = {
  messagesContainerRef: React.RefObject<HTMLDivElement>;
};

const ChatInput = ({ messagesContainerRef }: ChatInputProps) => {
  const dispatch = useAppDispatch();

  const currentModel = useAppSelector((state) => state.gpt.currentModel);
  const { isNewChat, currentChatId, error } = useAppSelector(
    (state) => state.message
  );
  const userId = useAppSelector((state) => state.auth.userId);

  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { trackMessage } = useTrackAnalytics();
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
      const userMessageId = uuidv4();
      const botMessageId = uuidv4();
      await dispatch(
        messageActions.fetchBotResponse({
          currentModel,
          file: selectedFile, //add pdf file
          msg,
          currentChatId: isNewChat ? newLogId : currentChatId,
          userId: userId ? userId : "",
          userMessageId,
          botMessageId,
        })
      ).unwrap();
      setSelectedFile(null);
      if (isNewChat) {
        dispatch(messageActions.setCurrentChatId(newLogId));
        navigate(`/user/${userId}/chat/${newLogId}`);
        dispatch(messageActions.toggleNewChat(false));
        dispatch(
          logActions.addLog({
            msg: msg,
            modelType: currentModel.title,
            id: newLogId,
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
      trackMessage({
        userMessageId: userMessageId,
        botMessageId: botMessageId,
        logId: isNewChat ? newLogId : currentChatId,
        assistantId: currentModel.id,
        hadFile: selectedFile ? true : false,
      });
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
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
        <FileUpload
          onChange={(file) => setSelectedFile(file)}
          selectedFile={selectedFile}
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
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 ease-in-out px-4 py-2 text-base"
          type="submit"
          variant="outline"
          disabled={isSending}
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin " />
          ) : (
            <IoSend className="text-2xl" />
          )}
        </Button>
      </form>
    </div>
  );
};
export default ChatInput;
