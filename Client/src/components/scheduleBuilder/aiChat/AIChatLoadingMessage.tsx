// file: ChatLoadingMessage.tsx
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCall } from "./SBChatMessage";
import ToolUsageDisplay from "./ToolUsageDisplay";

const AIChatLoadingMessage = ({
  msg,
  toolUsage,
}: {
  msg: string | undefined;
  toolUsage: ToolCall[] | undefined;
}) => {
  return (
    <motion.div
      className="flex flex-col space-y-2 mb-8 sm:mb-12 w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px] sm:w-[250px] bg-gray-300 dark:bg-slate-600/50" />
        <Skeleton className="h-4 w-[150px] sm:w-[200px] bg-gray-300 dark:bg-slate-600/50" />
        {toolUsage && (
          <motion.div
            className="text-xs sm:text-sm italic pt-1 relative overflow-hidden text-gray-400/70 dark:text-gray-400/70 w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {toolUsage && toolUsage.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full"
              >
                <ToolUsageDisplay toolUsage={toolUsage} />
              </motion.div>
            ) : (
              <motion.span
                style={{
                  background:
                    "linear-gradient(90deg, #9CA3AF 0%, #D1D5DB 50%, #9CA3AF 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#9CA3AF",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "200% 0%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {msg}
              </motion.span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIChatLoadingMessage;
