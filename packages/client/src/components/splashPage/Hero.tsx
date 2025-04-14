import { useNavigate } from "react-router-dom";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { motion } from "framer-motion";

const buttonVariants = {
  hover: {
    scale: 1.05,
    y: -3,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

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
      <motion.button
        onClick={() => navigate("/team")}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className="
          min-w-[280px] text-white text-xl font-black
          px-8 py-4 my-4 rounded-xl
          bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800
          hover:bg-gradient-to-br hover:from-slate-500 hover:via-slate-600 hover:to-slate-700
          transform transition-all duration-300
          shadow-2xl shadow-slate-900/40
          hover:shadow-3xl hover:shadow-slate-900/50
          relative overflow-hidden
          ring-2 ring-slate-600/20
          hover:ring-slate-500/40
        "
      >
        <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-white/30 to-transparent" />
        <div className="flex items-center justify-center space-x-3">
          <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
            Meet the Team
          </span>
          <motion.span
            animate={{ y: [0, -2, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="text-xl"
          >
            👥
          </motion.span>
        </div>
      </motion.button>
    </div>
  );
}
