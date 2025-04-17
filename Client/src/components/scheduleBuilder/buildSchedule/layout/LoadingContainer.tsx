import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingContainer = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for a more natural feel
      }}
      className="w-full"
    >
      <Skeleton className="h-4 w-3/4 mb-1" />

      <Skeleton className="h-4 w-full " />
    </motion.div>
  );
};

export default LoadingContainer;
