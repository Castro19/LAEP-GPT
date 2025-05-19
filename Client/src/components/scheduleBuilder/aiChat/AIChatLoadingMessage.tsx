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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px] sm:w-[250px] bg-gray-300 dark:bg-slate-600/50" />
        <Skeleton className="h-4 w-[150px] sm:w-[200px] bg-gray-300 dark:bg-slate-600/50" />
        {toolUsage && (
          <motion.div
            className="text-sm sm:text-md italic pt-1 relative overflow-hidden text-gray-400 w-full"
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
            {toolUsage && toolUsage.length > 0 ? (
              <ToolUsageDisplay toolUsage={toolUsage} />
            ) : (
              msg
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIChatLoadingMessage;
