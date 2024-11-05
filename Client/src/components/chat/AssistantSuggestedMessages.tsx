import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";

const AssistantSuggestedMessages = () => {
  const suggestions = [
    "Can you please help me find a senior project advisor?",
    "How was this assistant created?", // phrase this better
    "How was this assistant created?",
    "How was this assistant created?",
  ]; // or your array of 2 or 4 messages
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
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full p-4 gap-y-8">
        <TypewriterEffectSmooth words={words} />

        <div className="grid grid-cols-2 gap-3 max-w-[600px] mx-auto">
          {suggestions.map((message, index) => (
            <Button
              key={index}
              className="p-4 text-md dark:bg-slate-800 hover:dark:bg-slate-700 dark:text-gray-200 rounded-2xl text-left h-full min-h-[120px] text-pretty"
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
