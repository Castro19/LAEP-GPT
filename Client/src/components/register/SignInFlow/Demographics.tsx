import { motion } from "framer-motion";

// Components
import { RadioSurvey } from "@/components/ui/radio-survey";
import { Card } from "@/components/ui/card";

// Hooks
import { useUserData } from "@/hooks/useUserData";

// Icons & UI Components
import { RiUserHeartLine, RiGroupLine } from "react-icons/ri";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Demographics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Help us understand our community better
          </p>
        </div>

        <div className="space-y-8">
          {/* Gender Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <RiUserHeartLine className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium">Gender</h3>
            </div>
            <RadioSurvey
              items={genderItems}
              label=""
              handleChange={handleGenderChange}
              className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            />
          </div>

          {/* Ethnicity Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <RiGroupLine className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium">Ethnicity</h3>
            </div>
            <RadioSurvey
              items={ethnicityItems}
              label=""
              handleChange={handleEthnicityChange}
              className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            />
          </div>
        </div>

        {/* Optional Info Note */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          This information helps us match you with organizations and events. All
          responses are optional.
        </p>
      </Card>
    </motion.div>
  );
}
