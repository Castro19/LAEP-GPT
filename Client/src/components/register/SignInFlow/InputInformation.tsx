import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

// Components
import { Card } from "@/components/ui/card";

// Icons
import { RiAtLine, RiUserSearchLine, RiTimeLine } from "react-icons/ri";

const InputInformation = () => {
  // Get choice and handleChoice from outlet context
  const { choice, handleChoice } = useOutletContext<{
    choice: "now" | "later";
    // eslint-disable-next-line no-unused-vars
    handleChoice: (choice: "now" | "later") => void;
  }>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto my-sm:my-8 px-2 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
    >
      <Card className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-8">
        {/* Options */}
        <div className="grid grid-cols-1 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChoice("now")}
            className={`
              flex items-start p-4 rounded-lg border transition-all duration-150 ease-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                choice === "now"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
          >
            <div className="mr-4 mt-1">
              <RiUserSearchLine className="w-6 h-6 text-blue-500 mt-1" />
              <div className="flex-1 text-left space-y-1">
                <h3 className="font-medium my-1">Personalize Now (5 min)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Answer a few quick questions about your interests and academic
                  goals. This helps our AI provide more relevant recommendations
                  for classes, clubs, and events.
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChoice("later")}
            className={`
              flex items-start p-4 rounded-lg border transition-all duration-150 ease-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                choice === "later"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
          >
            <div className="mr-4 mt-1">
              <RiTimeLine className="w-6 h-6 text-blue-500 mt-1" />
              <div className="flex-1 text-left space-y-1">
                <h3 className="font-medium my-1">Skip for Now</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Start chatting right away! You can always personalize your
                  experience later through your profile settings.
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Info Note */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <RiAtLine className="inline-block w-4 h-4 mr-1" />
          Your AI assistant will work either way - personalization just helps
          make the recommendations more relevant to you.
        </div>
      </Card>
    </motion.div>
  );
};

export default InputInformation;
