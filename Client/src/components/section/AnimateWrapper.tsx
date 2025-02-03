import { motion } from "framer-motion";

const AnimateWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-full overflow-hidden no-scroll"
    >
      {children}
    </motion.div>
  );
};

export default AnimateWrapper;
