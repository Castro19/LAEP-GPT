import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Find Classes Instantly",
    description:
      "AI-powered search helps you discover the best Spring 2025 courses.",
    icon: "🚀",
  },
  {
    title: "Effortless Schedule Building",
    description: "Generate, customize, and optimize your weekly schedule.",
    icon: "📅",
  },
  {
    title: "Smart AI Insights",
    description:
      "Get schedule summaries, professor ratings, and personalized recommendations.",
    icon: "🤖",
  },
];

type FeatureSectionProps = {
  title: string;
  description: string;
  icon: string;
  index: number;
};

const FeatureSection = ({
  title,
  description,
  icon,
  index,
}: FeatureSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative p-4 w-full rounded-2xl bg-slate-800/5 backdrop-blur-sm hover:bg-slate-800/10 transition-all duration-300 cursor-default"
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500/10 to-gray-700/10 group-hover:from-slate-500/15 group-hover:to-gray-700/15 transition-all">
            <span className="text-xl">{icon}</span>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-200 to-gray-400 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
        <p className="text-base text-gray-300 pl-4">{description}</p>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl border border-gray-500/10 group-hover:border-gray-500/20 transition-all pointer-events-none" />
    </motion.div>
  );
};

// Usage example with your features array
const FeaturesGrid = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-4">
        {FEATURES.map((feature, index) => (
          <FeatureSection key={feature.title} index={index} {...feature} />
        ))}
      </div>

      {/* Integrated CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col justify-start items-start"
      >
        {/* Insert your improved CTA button here */}
      </motion.div>
    </div>
  );
};

export default FeaturesGrid;
