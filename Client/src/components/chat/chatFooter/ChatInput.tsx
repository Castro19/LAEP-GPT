/**
 * @component ChatInput
 * @description Handles user message input, submission, and interaction with the AI system.
 * Manages message sending, cancellation, and chat history limitations.
 *
 * @props
 * @prop {React.RefObject<HTMLDivElement>} messagesContainerRef - Reference to message container for scrolling
 * @prop {React.RefObject<HTMLTextAreaElement>} textareaRef - Reference to input textarea
 * @prop {React.RefObject<HTMLButtonElement>} sendButtonRef - Reference to send button
 *
 * @features
 * - Auto-expanding textarea
 * - Message character limit (2000)
 * - Chat history limit (12 messages)
 * - Stop generation button
 * - Enter to send (Shift+Enter for new line)
 * - Safe area inset for mobile
 *
 * @dependencies
 * - Redux: message and log actions
 * - UUID: For message ID generation
 * - React Router: For navigation
 *
 * @behavior
 * - Handles new and existing chat sessions
 * - Manages message sending and cancellation
 * - Updates chat history in database
 * - Handles navigation for new chats --> goes to chat id page
 *
 * @related
 * Redux: Client/src/redux/message/messageSlice.ts
 * - fetchBotResponse: Sends message to AI
 * - cancelBotResponse: Stops AI generation
 * - updateMsg: Updates input state
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
// React Redux
import { useAppDispatch, useAppSelector } from "@/redux";
import { messageActions, logActions } from "@/redux";
// Helpers
import {
  adjustTextareaHeight,
  resetInputAndScrollToBottom,
} from "@/components/chat";
import { transformSectionsToScheduleBuilderSections } from "@/helpers/transformSection";
import { environment } from "@/helpers/getEnvironmentVars";
// UI Components
import { Button } from "@/components/ui/button";
// Icons
import { IoSend, IoStopCircleOutline } from "react-icons/io5";

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
  // Local State
  const [currentUserMessageId, setCurrentUserMessageId] = useState<
    string | null
  >(null);
  const [lockedChat, setLockedChat] = useState(false);

  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const currentModel = useAppSelector((state) => state.assistant.currentModel);
  const { currentSchedule } = useAppSelector((state) => state.schedule);
  const { msg, isNewChat, currentChatId, loading, error, messagesByChatId } =
    useAppSelector((state) => state.message);

  const currentChatMessages = messagesByChatId[currentChatId ?? ""];

  useEffect(() => {
    if (currentChatMessages?.content.length >= 12) {
      setLockedChat(true);
    } else {
      setLockedChat(false);
    }
  }, [currentChatMessages, currentChatId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(messageActions.updateMsg(e.target.value));
    adjustTextareaHeight(e.target);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (msg.length <= 0) return;

    // Step 1: Clear the input field and reset UI
    dispatch(messageActions.updateMsg(""));
    resetInputAndScrollToBottom(textareaRef, messagesContainerRef);

    // Step 2: Generate unique IDs for the new conversation
    const newLogId = uuidv4();
    const userMessageId = uuidv4();
    setCurrentUserMessageId(userMessageId);
    const botMessageId = uuidv4();

    // Step 3: Clear any existing errors
    if (error) {
      dispatch(messageActions.clearError());
    }

    try {
      // Step 4: Determine the chat ID (use existing or create new)
      const logId = isNewChat ? newLogId : currentChatId;
      dispatch(messageActions.setCurrentChatId(logId));
      if (!logId) {
        throw new Error("Log ID is required");
      }

      // Step 5: Send message to bot and get response
      try {
        await dispatch(
          messageActions.fetchBotResponse({
            currentModel,
            msg,
            currentChatId: logId,
            userMessageId,
            botMessageId,
            // Include sections only for Schedule Analysis model
            sections:
              currentModel.title === "Schedule Analysis" &&
              currentSchedule &&
              currentSchedule.sections
                ? transformSectionsToScheduleBuilderSections(
                    currentSchedule.sections
                  )
                : [],
          })
        ).unwrap();
      } catch (error) {
        if (environment === "dev") {
          console.error("Failed to fetch bot response: ", error);
        }
      }

      // Step 6: If the chat is new, we toggle the new chat state to false
      if (isNewChat) {
        dispatch(messageActions.toggleNewChat(false));
      }

      // Step 7: Create/update log in database and handle navigation
      dispatch(
        logActions.upsertLog({
          logId,
          assistantMongoId: currentModel.id,
          msg: isNewChat ? msg : undefined,
        })
      )
        .unwrap()
        .then(({ logId }) => {
          if (isNewChat) {
            dispatch(messageActions.setCurrentChatId(logId));
            // Navigate to new chat URL only if not already on chat page
            if (location.pathname === "/chat") {
              navigate(`/chat/${logId}`);
            }
          }
        });
    } catch (error: unknown) {
      if (environment === "dev") {
        console.error("Failed to send message", error);
      }
    }
  };

  const handleStop = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (currentUserMessageId && currentChatId) {
      dispatch(
        messageActions.cancelBotResponse({
          userMessageId: currentUserMessageId,
          chatId: currentChatId,
        })
      );
    }
  };

  return (
    <div
      className="w-full mt-4 p-5 bg-slate-900 sticky bottom-0 border-t dark:border-slate-700"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {lockedChat ? (
        <div className="flex justify-center text-sm text-gray-500 px-2 pt-2">
          Chat history is too long. Please start a new chat.
        </div>
      ) : (
        <>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {msg.length > 1500 && (
            <div className="text-yellow-500 text-sm">
              You have reached {msg.length} of 2000 characters.
            </div>
          )}
          <form
            onSubmit={
              currentChatId && loading[currentChatId] ? () => {} : handleSubmit
            }
            className="flex items-end gap-2"
          >
            <textarea
              ref={textareaRef}
              id="ChatInput"
              className="flex-1 resize-none p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 overflow-y-hidden"
              placeholder="Type your message here..."
              rows={1}
              value={msg}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            {currentChatId && loading[currentChatId] ? (
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
                disabled={
                  currentChatId && loading[currentChatId]
                    ? true
                    : msg.length === 0
                }
                ref={sendButtonRef}
              >
                <IoSend className="text-2xl" />
              </Button>
            )}
          </form>
          <div className="flex justify-center text-sm text-gray-500 px-2 pt-2">
            AI-generated responses may contain inaccuracies
          </div>
        </>
      )}
    </div>
  );
};
export default ChatInput;
