import { motion } from "framer-motion";

// Components
import { CheckboxSurvey } from "@/components/ui/checkbox-survey";
import { Card } from "@/components/ui/card";

// Hooks
import { useUserData } from "@/hooks/useUserData";

// Icons
import { RiLightbulbLine, RiGamepadLine, RiFlag2Line } from "react-icons/ri";

export function Interests() {
  const { handleChange } = useUserData();

  const handleInterestChange = (interests: string[]) => {
    handleChange("interestAreas", interests);
  };

  const handleActivityChange = (activities: string[]) => {
    handleChange("preferredActivities", activities);
  };

  const handleGoalChange = (goals: string[]) => {
    handleChange("goals", goals);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 space-y-8 overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Your Interests</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Help us personalize your experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Interests Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <RiLightbulbLine className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium">Areas of Interest</h3>
            </div>
            <CheckboxSurvey
              label="What areas do you find interesting?"
              handleChange={handleInterestChange}
              className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            />
          </div>

          {/* Activities Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <RiGamepadLine className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium">Preferred Activities</h3>
            </div>
            <CheckboxSurvey
              label="What activities do you like to do?"
              handleChange={handleActivityChange}
              className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            />
          </div>

          {/* Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <RiFlag2Line className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium">College Goals</h3>
            </div>
            <CheckboxSurvey
              label="Goals for your college experience"
              handleChange={handleGoalChange}
              className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            />
          </div>
        </div>

        {/* Info Note */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Your interests help us provide better recommendations and connections
        </p>
      </Card>
    </motion.div>
  );
}
