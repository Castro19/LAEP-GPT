import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

const COPY = {
  beta: {
    title: "Schedule Builder (Beta)",
    description:
      "This feature is currently in beta and will receive updates in the coming days. Please double-check your final schedule with Cal Poly's official system.",
  },
  notes: {
    heading: "Things to Keep in Mind",
    listItems: [
      "This is an unofficial tool and is not affiliated with Cal Poly San Luis Obispo.",
      "Generated schedules may not reflect real-time availability.",
      "Always verify your final schedule through Cal Poly’s official registration system.",
    ],
  },
  disclaimer:
    "While we strive for accuracy, this tool is in development. Report any issues or feedback to help improve it!",
};

const EmptyCalendar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center h-full p-4"
    >
      <Card className="w-full max-w-lg p-8 space-y-8">
        {/* Beta Notice */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <FiAlertTriangle className="w-14 h-14 text-yellow-500 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-100 text-center">
            {COPY.beta.title}
          </h2>
          <p className="text-gray-500 text-lg text-center leading-relaxed">
            {COPY.beta.description}
          </p>
        </div>

        {/* Information Notice */}
        <div className="space-y-5">
          <div className="rounded-lg p-6 space-y-4 border border-yellow-500 dark:bg-transparent">
            <div className="flex items-center gap-2 text-slate-200 mb-2">
              <FiInfo className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-lg font-semibold">{COPY.notes.heading}</h3>
            </div>

            <ul className="space-y-3 text-gray-100">
              {COPY.notes.listItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-gray-500 text-center leading-snug">
            {COPY.disclaimer}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default EmptyCalendar;
