import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import {
  useAppDispatch,
  scheduleBuilderLogActions,
  scheduleActions,
  useAppSelector,
} from "@/redux";
import { GeneratedSchedule } from "@polylink/shared/types";

const SBAssistantSuggestedMessages = ({
  sendButtonRef,
}: {
  sendButtonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const dispatch = useAppDispatch();
  const { currentSchedule } = useAppSelector((state) => state.schedule);
  const suggestions = ["Build schedule from flowchart", "Summarize schedule"];

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
    await dispatch(scheduleBuilderLogActions.setDraftMsg(message));
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
    sendButtonRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center w-full max-w-[800px] gap-y-8">
        <TypewriterEffectSmooth words={words} size="small" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {suggestions?.map((message, index) => (
            <Button
              key={index}
              className="w-full p-4 text-md dark:bg-slate-800 hover:dark:bg-slate-700 dark:text-gray-200 rounded-xl text-left h-full min-h-[60px] whitespace-normal break-words"
              onClick={() => handleClick(message)}
            >
              {message}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SBAssistantSuggestedMessages;
