import { CheckboxSurvey } from "@/components/ui/checkbox-survey";

const activityItems = [
  {
    id: "learning-and-workshops",
    label: "Learning and Workshops",
  },
  {
    id: "competitions-and-challenges",
    label: "Competitions and Challenges",
  },
  {
    id: "social-events-and-networking",
    label: "Social Events and Networking",
  },
  {
    id: "outdoor-and-recreational-activities",
    label: "Outdoor and Recreational Activities",
  },
  {
    id: "volunteering-and-service-projects",
    label: "Volunteering and Service Projects",
  },
  {
    id: "study-and-collaborative-groups",
    label: "Study and Collaborative Groups",
  },
  {
    id: "other",
    label: "Other",
  },
];

export function ActivityPreferences() {
  return <CheckboxSurvey items={activityItems} label="Activity Preferences" />;
}
