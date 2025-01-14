import { RadioSurvey } from "@/components/ui/radio-survey";
import { useUserData } from "@/hooks/useUserData";

const genderItems = [
  {
    id: "male",
    label: "Male",
  },
  {
    id: "female",
    label: "Female",
  },
  {
    id: "nonBinary",
    label: "Non-binary",
  },
  {
    id: "preferNotToSay",
    label: "Prefer not to say",
  },
  {
    id: "other",
    label: "Other",
  },
];
const ethnicityItems = [
  {
    id: "white",
    label: "White",
  },
  {
    id: "hispanic",
    label: "Hispanic or Latino",
  },
  {
    id: "black",
    label: "Black or African American",
  },
  {
    id: "asian",
    label: "Asian",
  },
  {
    id: "native",
    label: "Native American or Alaskan Native",
  },
  {
    id: "pacific",
    label: "Pacific Islander",
  },
  {
    id: "multiracial",
    label: "Multiracial",
  },
  {
    id: "preferNotToSay",
    label: "Prefer not to say",
  },
  {
    id: "other",
    label: "Other",
  },
];

export function Demographics() {
  const { handleChangeDemographic } = useUserData();
  const handleGenderChange = (gender: string) => {
    handleChangeDemographic(
      "gender",
      gender as "male" | "female" | "nonBinary" | "preferNotToSay" | "other"
    );
  };
  const handleEthnicityChange = (ethnicity: string) => {
    handleChangeDemographic(
      "ethnicity",
      ethnicity as
        | "white"
        | "hispanic"
        | "black"
        | "asian"
        | "native"
        | "pacific"
        | "multiracial"
        | "preferNotToSay"
        | "other"
    );
  };
  return (
    <div>
      <RadioSurvey
        items={genderItems}
        label="Gender"
        handleChange={handleGenderChange}
      />
      <RadioSurvey
        items={ethnicityItems}
        label="Ethnicity"
        handleChange={handleEthnicityChange}
      />
    </div>
  );
}
