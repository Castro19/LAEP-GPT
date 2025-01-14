import { CheckboxSurvey } from "@/components/ui/checkbox-survey";
import { useUserData } from "@/hooks/useUserData";

const goalsItems = [
  {
    id: "developing-new-skills",
    label: "Developing new skills",
  },
  {
    id: "networking-and-making-connections",
    label: "Networking and making connections",
  },
  {
    id: "building-friendships",
    label: "Building friendships",
  },
  {
    id: "gaining-leadership-experience",
    label: "Gaining leadership experience",
  },
  {
    id: "contributing-to-the-community",
    label: "Contributing to the community",
  },
  {
    id: "other",
    label: "Other",
  },
];

export function Goals() {
  const { handleChange } = useUserData();
  const handleGoalChange = (goals: string[]) => {
    const newGoals = goals.filter((goal) => goal !== "other");
    handleChange("goals", newGoals);
  };
  return (
    <CheckboxSurvey
      items={goalsItems}
      label="Goals"
      handleChange={handleGoalChange}
    />
  );
}
