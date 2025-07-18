/**
 * @component ChatLoadingMessage
 * @description Displays a loading state animation when the AI is processing a response.
 * Shows tool usage information when the AI is using specific tools.
 *
 * @props
 * @prop {string | null} toolUsage - Current tool being used by the AI, if any
 *
 * @dependencies
 * - framer-motion: For loading animations
 * - Skeleton: For loading placeholder UI
 *
 * @state
 * Connected to Redux message slice:
 * - thinkingState: Controls visibility
 * - toolUsage: Shows current AI tool activity
 *
 * @implementation
 * - Uses framer-motion for smooth fade-in animation
 * - Displays skeleton loading UI for message preview
 * - Shows tool usage with animated gradient text
 * - Responsive design for different screen sizes
 *
 * @related
 * Redux: Client/src/redux/message/messageSlice.ts
 * - updateThinkingState: Controls loading visibility
 * - setToolUsage: Updates tool usage display
 */

// file: ChatLoadingMessage.tsx
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const ChatLoadingMessage = ({ toolUsage }: { toolUsage: string | null }) => {
  return (
    <motion.div
      className="flex items-center space-x-4 mb-8 sm:mb-12 w-full max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-300 dark:bg-slate-600/50" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[200px] sm:w-[250px] bg-gray-300 dark:bg-slate-600/50" />
        <Skeleton className="h-4 w-[150px] sm:w-[200px] bg-gray-300 dark:bg-slate-600/50" />
        {toolUsage && (
          <motion.div
            className="text-sm sm:text-md italic pt-1 relative overflow-hidden text-gray-400 dark:text-gray-400 w-full"
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
            {toolUsage}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatLoadingMessage;
