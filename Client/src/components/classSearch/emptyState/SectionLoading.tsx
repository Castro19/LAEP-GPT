/**
 * @component SectionLoading
 * @description Loading indicator displayed while fetching course sections. Shows animated
 * dots with loading text.
 *
 * @props
 * None - Component manages its own state
 *
 * @dependencies
 * - Framer Motion: Animated dots and text
 * - cn utility: Class name merging
 *
 * @features
 * - Animated bouncing dots (3 dots with staggered delays)
 * - Loading text with fade-in animation
 * - Dark/light mode color support
 * - Smooth entrance/exit animations
 * - Responsive design
 *
 * @example
 * ```tsx
 * <SectionLoading />
 * ```
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a className utility

const LOADER_COLORS = {
  light: "text-blue-500",
  dark: "dark:text-blue-400",
};

const SectionLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-4 p-8"
    >
      {/* Animated Dots */}
      <div className="flex items-center justify-center gap-2">
        {[0, 0.2, 0.4].map((delay) => (
          <motion.span
            key={delay}
            initial="initial"
            animate={{
              y: [-4, 0],
              transition: {
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: delay,
              },
            }}
            className={cn(
              "h-2 w-2 rounded-full",
              LOADER_COLORS.light,
              LOADER_COLORS.dark
            )}
          />
        ))}
      </div>

      {/* Subtle Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium text-gray-600 dark:text-gray-300"
      >
        Loading Sections...
      </motion.p>
    </motion.div>
  );
};

export default SectionLoading;
