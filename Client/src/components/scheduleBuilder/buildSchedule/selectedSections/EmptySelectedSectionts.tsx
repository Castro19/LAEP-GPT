import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux";
import { classSearchActions } from "@/redux";
import { useNavigate } from "react-router-dom";

const EmptySelectedSectionts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentScheduleTerm } = useAppSelector((state) => state.schedule);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1,
      }}
      className="p-2 text-gray-700 dark:text-slate-200 text-sm"
    >
      The sections you select from the{" "}
      <strong
        className="text-blue-600/80 dark:text-blue-300 cursor-pointer"
        onClick={() => {
          dispatch(
            classSearchActions.setFilters({
              term: currentScheduleTerm,
            })
          );
          navigate("/class-search");
        }}
      >
        Class Search
      </strong>{" "}
      page will appear here
    </motion.div>
  );
};

export default EmptySelectedSectionts;
