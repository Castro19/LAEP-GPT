import { useNavigate } from "react-router-dom";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
export function Hero() {
  const navigate = useNavigate();
  const words = [
    {
      text: "Want",
    },
    {
      text: "to",
    },
    {
      text: "help",
    },
    {
      text: "build",
    },
    {
      text: "PolyLink?",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-start bg-white dark:bg-slate-900 bg-opacity-50">
      <TypewriterEffectSmooth words={words} />
      <button className="w-40 h-10 my-4 rounded-xl bg-white text-black border border-black  text-sm">
        Join the Team!
      </button>
    </div>
  );
}
