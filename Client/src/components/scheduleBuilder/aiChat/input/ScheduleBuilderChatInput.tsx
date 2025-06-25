import React, { useRef, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
  scheduleBuilderLogActions,
  scheduleActions,
} from "@/redux";
import { nanoid } from "nanoid";
// My components:
import { ConversationTurn } from "@polylink/shared/types/scheduleBuilderLog";
import {
  CourseTerm,
  GeneratedSchedule,
  ScheduleResponse,
} from "@polylink/shared/types";
// UI components:
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
// helpers
import { resetInputAndScrollToBottom } from "@/components/chat/helpers/formatHelper";

/**
 * ScheduleBuilderChatInput - Input component for AI chat in schedule builder
 *
 * This component provides the chat input interface with placeholder suggestions,
 * message handling, and integration with the schedule builder AI system. It manages
 * user input, message submission, and state synchronization with Redux.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.RefObject<HTMLDivElement>} props.messagesContainerRef - Reference to messages container for scroll management
 * @param {React.RefObject<HTMLTextAreaElement>} props.textAreaRef - Reference to textarea for input management
 * @param {React.RefObject<HTMLButtonElement>} props.sendButtonRef - Reference to send button for form submission
 *
 * @example
 * ```tsx
 * <ScheduleBuilderChatInput
 *   messagesContainerRef={messagesContainerRef}
 *   textAreaRef={textAreaRef}
 *   sendButtonRef={sendButtonRef}
 * />
 * ```
 *
 * @dependencies
 * - Redux store for schedule and schedule builder log state
 * - PlaceholdersAndVanishInput for enhanced input experience
 * - nanoid for unique ID generation
 * - Format helper for input and scroll management
 *
 * @features
 * - Placeholder suggestions for common queries
 * - Real-time input validation and character counting
 * - Optimistic message updates for better UX
 * - Automatic schedule initialization
 * - Thread management for conversation continuity
 * - Error handling and user feedback
 * - Loading state management
 *
 * @inputHandling
 * - handleInputChange: Updates draft message in Redux
 * - handleSubmit: Processes message submission
 * - Auto-focus on component mount
 * - Character limit enforcement (2000 chars)
 * - Input clearing after submission
 *
 * @state
 * - Redux state for draft message, current log, and loading states
 * - Local refs for input management
 * - Thread ID management for conversation continuity
 *
 * @placeholders
 * - "Find GE B classes in the morning"
 * - "Find open CSC101 classes"
 * - "Add an easy USCP class"
 *
 * @validation
 * - Empty message prevention
 * - Character limit validation
 * - Loading state validation
 * - Schedule state validation
 *
 * @styling
 * - Dark theme with slate colors
 * - Fixed height input area
 * - Error and warning message styling
 * - Responsive design
 * - Safe area inset support
 */
const placeholders = [
  "Find GE B classes in the morning",
  "Find open CSC101 classes",
  "Add an easy USCP class",
];

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

  const { currentScheduleTerm, currentSchedule, preferences } = useAppSelector(
    (state) => state.schedule
  );
  const { draftMsg, currentLog, error, loadingByThread } = useAppSelector(
    (state) => state.scheduleBuilderLog
  );

  const threadId = currentLog?.thread_id;
  const lockedChat = !!loadingByThread[threadId || ""];

  /* handlers ----------------------------------------------------------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(scheduleBuilderLogActions.setDraftMsg(e.target.value));
  };

  const handleSubmit = async () => {
    if (!draftMsg.trim() || lockedChat) return;

    // Ensure currentSchedule is set
    if (!currentSchedule) {
      const currentBlankSchedule: GeneratedSchedule = {
        sections: [],
        customEvents: [],
        name: "New Schedule",
        id: "",
        averageRating: 0,
      };

      dispatch(scheduleActions.setCurrentSchedule(currentBlankSchedule));
    }

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
          term: currentScheduleTerm as CourseTerm,
          suggestedSections: [],
          potentialSections: [],
          user_query: "",
          preferences,
          currentSchedule: currentSchedule as unknown as ScheduleResponse,
          diff: { added: [], removed: [] },
        },
      })
    );
  };

  /* autofocus once ----------------------------------------------------- */
  useEffect(() => {
    inputRef.current?.focus();
    if (!currentSchedule) {
      const currentBlankSchedule: GeneratedSchedule = {
        sections: [],
        customEvents: [],
        name: "New Schedule",
        id: "",
        averageRating: 0,
      };
      dispatch(scheduleActions.setCurrentSchedule(currentBlankSchedule));
    }
  }, []);

  /* render ------------------------------------------------------------- */
  return (
    <div
      className="w-full h-full bg-gray-900/95 border-t dark:border-gray-700 flex flex-col"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex flex-col gap-2">
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {draftMsg.length > 1500 && (
          <div className="text-yellow-500 text-sm">
            You have reached {draftMsg.length} of 2000 characters.
          </div>
        )}

        <div className="flex items-center gap-2 p-4 flex-1 w-full">
          <div className="flex-1 w-full">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              maxLength={2000}
              interval={5000}
              loading={lockedChat}
              disabled={lockedChat}
              sendButtonRef={sendButtonRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBuilderChatInput;
