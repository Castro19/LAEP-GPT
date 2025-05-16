import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FiInfo, FiCalendar } from "react-icons/fi";

const COPY = {
  emptyState: {
    title: "Ready to Build Your Schedule!",
    heading: "Here's how to get started:",
    descriptionList: [
      {
        startText: "Press the ",
        strongText: "Generate Schedule",
        endText:
          " button to create all possible combinations of your selected sections based on your preferences.",
      },
      {
        startText: "Or click ",
        strongText: "New Schedule",
        endText: " to start with a blank schedule and add sections manually.",
      },
      {
        startText: "Found your perfect schedule? Hit ",
        strongText: "Save Schedule",
        endText: " to keep it for later.",
      },
    ],
    cta: "Generate Schedule",
  },
  primarySchedule: {
    heading: "Why save your schedule?",
    descriptionList: [
      {
        startText:
          "Filter out time conflicting sections when searching for sections in ",
        strongText: "Class Search",
        endText: ".",
      },
      {
        startText: "Chat with our ",
        strongText: "Schedule Analysis AI Assistant",
        endText: " to get help finding the best schedule for you.",
      },
      {
        startText: "Easily ",
        strongText: "update your schedule",
        endText: " as you make changes to your course selections.",
      },
    ],
  },
  disclaimer:
    "Not affiliated with Cal Poly SLO administration. Always confirm with official Cal Poly systems final schedule",
};

const EmptySchedule = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex justify-center items-center h-full p-4"
    >
      <Card className="w-full max-w-2xl p-8 space-y-8 bg-gray-800/50 border-gray-700">
        {/* Primary Empty State */}
        <div className="space-y-6 text-center">
          <div className="inline-flex p-4 bg-blue-500/20 rounded-full">
            <FiCalendar className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 leading-tight">
            {COPY.emptyState.title}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-gray-700/30 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FiInfo className="w-4 h-4 text-gray-500" />
              {COPY.emptyState.heading}
            </h4>
            <ul className="space-y-2.5 text-gray-400 text-md">
              {COPY.emptyState.descriptionList.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▸</span>
                  <span className="flex-1">
                    {item.startText}
                    <strong className="text-blue-300">{item.strongText}</strong>
                    {item.endText}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Beta Notice & Information */}
        <div className="space-y-4 mt-8">
          <div className="p-5 bg-green-800/30 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FiInfo className="w-4 h-4 text-green-800" />
              {COPY.primarySchedule.heading}
            </h4>
            <ul className="space-y-2.5 text-gray-400 text-md">
              {COPY.primarySchedule.descriptionList.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-700 mt-1">▸</span>
                  <span className="flex-1">
                    {item.startText}
                    <strong className="text-green-600">
                      {item.strongText}
                    </strong>
                    {item.endText}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-gray-500 text-sm text-center px-4">
          {COPY.disclaimer}
        </p>
      </Card>
    </motion.div>
  );
};

export default EmptySchedule;
