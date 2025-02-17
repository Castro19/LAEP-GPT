import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FiSearch, FiInfo } from "react-icons/fi";

const COPY = {
  welcome: {
    title: "Welcome to Spring 2025 Section Search",
    description:
      "Start searching for available Spring 2025 sections to find courses that match your academic goals and schedule needs.",
  },
  notes: {
    heading: "Important Information",
    listItems: [
      "This service is not affiliated with Cal Poly San Luis Obispo",
      "Enrollment data may be delayed by up to one hour",
      "Data updates occur hourly at :10 past the hour (e.g., 8:10, 9:10, 10:10)",
    ],
  },
  disclaimer:
    "We strive to provide the most current information available. Always verify critical enrollment details directly with official sources.",
};

const InitialSectionState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center h-full p-4"
    >
      <Card className="w-full max-w-lg p-8 space-y-8">
        {/* Search Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <FiSearch className="w-14 h-14 text-blue-600/80 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-100 text-center">
            {COPY.welcome.title}
          </h2>
          <p className="text-gray-500 text-lg text-center leading-relaxed">
            {COPY.welcome.description}
          </p>
        </div>

        {/* Information Notice */}
        <div className="space-y-5">
          <div className="rounded-lg p-6 space-y-4 border border-blue-500 dark:bg-transparent">
            <div className="flex items-center gap-2 text-slate-200 mb-2">
              <FiInfo className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-lg font-semibold">{COPY.notes.heading}</h3>
            </div>

            <ul className="space-y-3 text-gray-100">
              {COPY.notes.listItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
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

export default InitialSectionState;
