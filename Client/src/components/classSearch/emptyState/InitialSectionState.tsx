import { Card } from "@/components/ui/card";
import { useAppDispatch, layoutActions } from "@/redux";
import { motion } from "framer-motion";
import { FiSearch, FiInfo } from "react-icons/fi";

const COPY = {
  welcome: {
    title: "Welcome to Class Search!",
    description:
      "Find the perfect Spring 2025 sections to match your academic goals and schedule needs.",
  },
  notes: {
    heading: "Important Information",
    listItems: [
      "This service is not affiliated with Cal Poly San Luis Obispo",
      "Enrollment data may be delayed by up to one hour",
      "Data updates occur hourly at :10 past the hour (e.g., 8:10, 9:10, 10:10)",
    ],
  },
  aiFeature: {
    heading: "Try Our",
    buttonText: "AI Class Search",
    headingEnd: "Feature",
    description:
      "Use our AI Assistant to query the best sections for your academic goals.",
  },
  disclaimer:
    "We strive to provide the most current information available. Always verify critical enrollment details directly with official sources.",
};

const InitialSectionState: React.FC = () => {
  const dispatch = useAppDispatch();
  const onAIFeatureClick = () => {
    dispatch(layoutActions.toggleMenu(true));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center h-full p-4"
    >
      <Card className="w-full max-w-2xl p-8 space-y-8 bg-gray-800/50 border-gray-700">
        {/* Search Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex p-4 bg-blue-500/20 rounded-full">
            <FiSearch className="w-14 h-14 text-blue-600/80" />
          </div>
          <h2 className="text-3xl font-bold text-gray-100">
            {COPY.welcome.title}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            {COPY.welcome.description}
          </p>
        </div>
        {/* AI Feature Suggestion */}
        <div className="space-y-4 mt-8">
          <div className="p-5 bg-green-800/30 rounded-lg">
            <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FiInfo className="w-4 h-4 text-green-800" />
              {COPY.aiFeature.heading}
              <span
                className="text-green-600 font-bold cursor-pointer"
                onClick={onAIFeatureClick}
              >
                {COPY.aiFeature.buttonText}
              </span>
              {COPY.aiFeature.headingEnd}
            </h4>
            <p className="text-gray-400 text-md">
              {COPY.aiFeature.description}
            </p>
          </div>
        </div>

        {/* Information Notice */}
        <div className="space-y-5">
          <div className="p-6 bg-gray-700/30 rounded-lg">
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
        </div>
        <p className="text-sm text-gray-500 text-center leading-snug">
          {COPY.disclaimer}
        </p>
      </Card>
    </motion.div>
  );
};

export default InitialSectionState;
