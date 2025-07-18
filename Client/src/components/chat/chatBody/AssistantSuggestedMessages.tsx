/**
 * @component AssistantSuggestedMessages
 * @description Displays suggested questions for new chat sessions. Appears only at the start of a conversation
 * and disappears after the first message is sent.
 *
 * @props
 * @prop {React.RefObject<HTMLButtonElement>} sendButtonRef - Reference to trigger message sending
 *
 * @dependencies
 * - Redux: currentModel (suggestedQuestions), messageActions
 * - TypewriterEffectSmooth: Welcome message animation
 *
 * @example
 * ```tsx
 * const sendButtonRef = useRef<HTMLButtonElement>(null);
 * <AssistantSuggestedMessages sendButtonRef={sendButtonRef} />
 * ```
 */

import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { messageActions, useAppDispatch, useAppSelector } from "@/redux";

const AssistantSuggestedMessages = ({
  sendButtonRef,
}: {
  sendButtonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const { currentModel } = useAppSelector((state) => state.assistant);

  const dispatch = useAppDispatch();
  const suggestions = currentModel.suggestedQuestions;

  const words = [
    {
      text: "How",
    },
    {
      text: "can",
    },
    {
      text: "I",
    },
    {
      text: "assist",
    },
    {
      text: "you?",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  const handleClick = async (message: string) => {
    await dispatch(messageActions.updateMsg(message));
    sendButtonRef.current?.click();
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full p-4 gap-y-8">
        <TypewriterEffectSmooth words={words} />

        <div className="grid grid-cols-2 gap-3 max-w-[600px] overflow-x-auto mx-auto">
          {suggestions?.map((message, index) => (
            <Button
              key={index}
              className="p-4 text-md dark:bg-slate-800 hover:dark:bg-slate-700 dark:text-gray-200 rounded-2xl text-left h-full min-h-[120px] whitespace-normal break-words"
              onClick={() => handleClick(message)}
            >
              {message}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AssistantSuggestedMessages;
