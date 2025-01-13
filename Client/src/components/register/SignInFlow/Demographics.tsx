import { RadioSurvey } from "@/components/ui/radio-survey";

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
  const handleGenderChange = (gender: string) => {
    console.log("Gender", gender);
  };
  const handleEthnicityChange = (ethnicity: string) => {
    console.log("Ethnicity", ethnicity);
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
