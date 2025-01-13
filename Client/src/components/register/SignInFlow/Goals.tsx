import { CheckboxSurvey } from "@/components/ui/checkbox-survey";

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
  return <CheckboxSurvey items={goalsItems} label="Goals" />;
}
