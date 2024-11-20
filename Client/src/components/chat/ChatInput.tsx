import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSend, IoStopCircleOutline } from "react-icons/io5";

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
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  sendButtonRef: React.RefObject<HTMLButtonElement>;
};

const ChatInput = ({
  messagesContainerRef,
  textareaRef,
  sendButtonRef,
}: ChatInputProps) => {
  const dispatch = useAppDispatch();
  const [currentUserMessageId, setCurrentUserMessageId] = useState<
    string | null
  >(null);
  const currentModel = useAppSelector((state) => state.gpt.currentModel);
  const { msg, isNewChat, currentChatId, isLoading, error } = useAppSelector(
    (state) => state.message
  );
  const userId = useAppSelector((state) => state.auth.userId);

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { trackCreateMessage, trackUpdateMessage } = useTrackAnalytics();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(messageActions.updateMsg(e.target.value));
    adjustTextareaHeight(e.target);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    dispatch(messageActions.updateMsg(""));
    resetInputAndScrollToBottom(textareaRef, messagesContainerRef);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    // Generate a new unique chatId
    const newLogId = uuidv4();
    const userMessageId = uuidv4();
    setCurrentUserMessageId(userMessageId);
    const botMessageId = uuidv4();
    const createdAt = new Date(); // Changed from Date.now()
    if (error) {
      dispatch(messageActions.clearError()); // Clear error when user starts typing
    }
    try {
      trackCreateMessage({
        userMessageId: userMessageId,
        botMessageId: botMessageId,
        logId: isNewChat ? newLogId : currentChatId,
        assistantId: currentModel.id,
        hadFile: selectedFile ? true : false,
        createdAt,
      });
    } catch (error) {
      console.error("Failed to track message: ", error);
    }
    try {
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
        dispatch(messageActions.toggleNewChat(false));
        dispatch(
          logActions.addLog({
            msg,
            modelTitle: currentModel.title,
            id: newLogId,
          })
        )
          .unwrap()
          .then(({ logId }) => {
            dispatch(messageActions.setCurrentChatId(logId));
            navigate(`/chat/${logId}`);
          });
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
      trackUpdateMessage({
        userMessageId,
        userMessage: null,
        createdAt,
        hadError: false,
        errorMessage: null,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to send message", error);
      trackUpdateMessage({
        userMessageId,
        userMessage: msg,
        createdAt,
        hadError: true,
        errorMessage: error.message
          ? error.message
          : "An unknown error occurred",
      });
    }
  };

  const handleStop = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (currentUserMessageId) {
      dispatch(messageActions.cancelBotResponse(currentUserMessageId));
    }
  };

  useEffect(() => {
    if (currentModel.title === "Matching Assistant") {
      setSelectedFile(null);
    }
  }, [currentModel]);
  return (
    <div className="w-full mt-4 p-5 bg-slate-900 sticky bottom-0 border-t dark:border-slate-700">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {msg.length > 1500 && (
        <div className="text-yellow-500 text-sm">
          You have reached {msg.length} of 2000 characters.
        </div>
      )}
      <form
        onSubmit={isLoading ? () => {} : handleSubmit}
        className="flex items-end gap-2"
      >
        {currentModel.title !== "Matching Assistant" && (
          <FileUpload
            onChange={(file) => setSelectedFile(file)}
            selectedFile={selectedFile}
          />
        )}
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
        {isLoading ? (
          <Button
            className="dark:bg-transparent hover:bg-gray-800 dark:hover:bg-slate-800 focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-300 ease-in-out px-4 py-2 text-base text-white"
            type="submit"
            variant="outline"
            ref={sendButtonRef}
            onClick={handleStop}
          >
            <IoStopCircleOutline className="text-red-500 text-3xl" />
          </Button>
        ) : (
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 ease-in-out px-4 py-2 text-base"
            type="submit"
            variant="outline"
            disabled={isLoading || msg.length === 0}
            ref={sendButtonRef}
          >
            <IoSend className="text-2xl" />
          </Button>
        )}
      </form>
    </div>
  );
};
export default ChatInput;
