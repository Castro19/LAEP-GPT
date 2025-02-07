import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // Progress percentage (0-100)
}

const steps = [
  { label: "Choose Catalog", step: 1 },
  { label: "Choose Major", step: 2 },
  { label: "Choose Concentration", step: 3 },
];

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="relative w-full">
      {/* Step Circles */}
      <div className="flex justify-between items-center w-full mb-4 relative">
        {steps.map(({ label, step }, index) => (
          <div key={index} className="flex flex-col items-center w-1/3 text-center">
            {/* Animated Step Circle */}
            <motion.div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white transition-all ${
                value >= (step / 3) * 100
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg"
                  : "bg-gray-700 text-gray-300"
              }`}
              //  animate={{ scale: value >= (step / 3) * 100 ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {step}
            </motion.div>

            {/* Step Label */}
            <p
              className={`text-sm mt-2 ${
                value >= (step / 3) * 100 ? "text-blue-400 font-semibold" : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden shadow-md">
        {/* Animated Progress Fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
          style={{ width: `${value}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
