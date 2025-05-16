import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { nanoid } from "nanoid";

import {
  useAppDispatch,
  useAppSelector,
  scheduleBuilderLogActions,
} from "@/redux"; // <- barrel exports from new slice

import {
  adjustTextareaHeight,
  resetInputAndScrollToBottom,
} from "@/components/chat/helpers/formatHelper";
import { ConversationTurn } from "@polylink/shared/types/scheduleBuilderLog";
import { CourseTerm, ScheduleResponse } from "@polylink/shared/types";

interface Props {
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  sendButtonRef: React.RefObject<HTMLButtonElement>;
}

const ScheduleBuilderChatInput: React.FC<Props> = ({
  messagesContainerRef,
  textAreaRef,
  sendButtonRef,
}) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentScheduleTerm, currentSchedule } = useAppSelector(
    (state) => state.schedule
  );
  const { draftMsg, currentLog, error, loadingByThread } = useAppSelector(
    (state) => state.scheduleBuilderLog
  );

  const threadId = currentLog?.thread_id;
  const lockedChat = !!loadingByThread[threadId || ""];

  /* handlers ----------------------------------------------------------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(scheduleBuilderLogActions.setDraftMsg(e.target.value));
    adjustTextareaHeight(e.target);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftMsg.trim() || lockedChat) return;

    if (!currentLog) {
      dispatch(scheduleBuilderLogActions.newScheduleChat());
    }

    const placeholderTurnId = nanoid();
    /* optimistic user turn */
    const userTurn = {
      turn_id: placeholderTurnId,
      timestamp: new Date().toISOString(),
      messages: [{ msg_id: nanoid(), role: "user", msg: draftMsg }],
    };

    dispatch(
      scheduleBuilderLogActions.appendUserTurnLocally(
        userTurn as unknown as ConversationTurn
      )
    );
    dispatch(scheduleBuilderLogActions.setDraftMsg("")); // clear input immediately
    resetInputAndScrollToBottom(textAreaRef, messagesContainerRef);

    if (inputRef.current) inputRef.current.value = "";

    /* send to backend */
    dispatch(
      scheduleBuilderLogActions.sendMessage({
        text: draftMsg,
        placeholderTurnId,
        state: {
          user_id: "",
          term: currentScheduleTerm as CourseTerm,
          sections: [],
          user_query: "",
          schedule_id: currentSchedule?.id || "",
          diff: { added: [], removed: [] },
          preferences: { with_time_conflicts: true },
          currentSchedule: currentSchedule as unknown as ScheduleResponse,
        },
      })
    );
  };

  const handleCancel = () => {
    dispatch(scheduleBuilderLogActions.setDraftMsg(""));
    if (inputRef.current) inputRef.current.value = "";
  };

  /* autofocus once ----------------------------------------------------- */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* render ------------------------------------------------------------- */
  return (
    <div
      className="w-full mt-4 p-5 bg-slate-900 sticky bottom-0 border-t dark:border-slate-700"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {lockedChat ? (
        <div className="flex justify-center text-sm text-gray-500 px-2 pt-2">
          Waiting for assistant…
        </div>
      ) : (
        <>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {draftMsg.length > 1500 && (
            <div className="text-yellow-500 text-sm">
              You have reached {draftMsg.length} of 2000 characters.
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-4 border-t border-slate-700"
          >
            <textarea
              ref={textAreaRef}
              id="ChatInput"
              className="flex-1 resize-none p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 overflow-y-hidden"
              placeholder="Type your message here..."
              rows={1}
              value={draftMsg}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            {lockedChat ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                ref={sendButtonRef}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="outline"
                className="bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 px-4 py-2"
                disabled={!draftMsg.trim()}
                ref={sendButtonRef}
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default ScheduleBuilderChatInput;
