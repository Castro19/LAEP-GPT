import { CheckboxSurvey } from "@/components/ui/checkbox-survey";
import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { RootState } from "@/redux/store";

const interestItems = [
  {
    id: "technology-and-innovation",
    label: "Technology and Innovation",
  },
  {
    id: "arts-and-design",
    label: "Arts and Design",
  },
  {
    id: "sports-and-wellness",
    label: "Sports and Wellness",
  },
  {
    id: "community-engagement",
    label: "Community Engagement",
  },
  {
    id: "professional-growth",
    label: "Professional Growth",
  },
  {
    id: "global-awareness-and-diversity",
    label: "Global Awareness and Diversity",
  },
  {
    id: "other",
    label: "Other (Please specify)",
  },
];

export function Interests() {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state: RootState) => state.user);

  const handleInterestChange = (interests: string[]) => {
    const newInterests = interests.filter((interest) => interest !== "other");
    console.log("Interests", newInterests);
  };

  return (
    <CheckboxSurvey
      items={interestItems}
      label="Interest Areas"
      handleChange={handleInterestChange}
    />
  );
}
