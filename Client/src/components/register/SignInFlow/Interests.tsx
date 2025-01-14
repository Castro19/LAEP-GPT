import { CheckboxSurvey } from "@/components/ui/checkbox-survey";
import { useUserData } from "@/hooks/useUserData";

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
    <div>
      <CheckboxSurvey
        label="What areas do you find interesting?"
        handleChange={handleInterestChange}
      />
      <Border />
      <CheckboxSurvey
        label="What activities do you like to do?"
        handleChange={handleActivityChange}
      />
      <Border />
      <CheckboxSurvey
        label="Goals for your college experience"
        handleChange={handleGoalChange}
      />
    </div>
  );
}

const Border = () => {
  return <div className="border-b border-gray-200" />;
};
