import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/hooks/useUserData";
import { useAppDispatch, useAppSelector } from "@/redux";
import { RootState } from "@/redux/store";
import ReusableDropdown from "@/components/ui/reusable-dropdown";
import { MAJORS } from "@/calpolyData/majors";
import { setSelection } from "@/redux/flowSelection/flowSelectionSlice";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  RiGraduationCapLine,
  RiCalendarLine,
  RiUserStarLine,
} from "react-icons/ri";

export const labelStyle = "underline text-lg self-center";

const years = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "graduate", label: "Graduate" },
];

const YEAR_OPTIONS = ["2019", "2020", "2021", "2022", "2023", "2024"];

const BasicInformation = ({
  showStartingYear = true,
}: {
  showStartingYear?: boolean;
}) => {
  const { handleChange, handleChangeFlowchartInformation } = useUserData();
  const { userData } = useAppSelector((state: RootState) => state.user);
  const { selections } = useAppSelector((state) => state.flowSelection);

  const dispatch = useAppDispatch();

  const handleChangeOption = (key: string, value: string) => {
    handleChangeFlowchartInformation(
      key as "startingYear" | "catalog" | "major" | "concentration",
      value
    );
    dispatch(
      setSelection({
        key: key as "startingYear" | "catalog" | "major" | "concentration",
        value: value,
      })
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
          <h2 className="text-2xl font-semibold">Basic Information</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please share some basic information about yourself
          </p>
        </div>

        <div className="space-y-6">
          {/* Starting Year Selection */}
          {showStartingYear && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <RiCalendarLine className="w-5 h-5 text-blue-500" />
                <Label className="text-lg font-medium">Starting Year</Label>
              </div>
              <ReusableDropdown
                name="startingYear"
                dropdownItems={YEAR_OPTIONS}
                handleChangeItem={(_, value) =>
                  handleChangeOption("startingYear", value)
                }
                selectedItem={
                  selections.startingYear ||
                  userData.flowchartInformation.startingYear ||
                  ""
                }
                className="w-full border rounded-lg hover:border-blue-300 transition-colors"
              />
            </div>
          )}

          {/* Year Selection */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <RiUserStarLine className="w-5 h-5 text-blue-500" />
              <Label className="text-lg font-medium">Current Year</Label>
            </div>
            <RadioGroup
              value={userData?.year || ""}
              onValueChange={(value) =>
                handleChange(
                  "year",
                  value as
                    | "freshman"
                    | "sophomore"
                    | "junior"
                    | "senior"
                    | "graduate"
                )
              }
              className="rounded-lg p-4 transition-colors"
            >
              <div className="grid grid-cols-2 gap-4">
                {years.map((year) => (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={year.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={year.value}
                      id={`year${year.value}`}
                      className="text-blue-500"
                    />
                    <Label
                      htmlFor={`year${year.value}`}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {year.label}
                    </Label>
                  </motion.div>
                ))}
              </div>
            </RadioGroup>
          </div>
          {/* Major Selection */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <RiGraduationCapLine className="w-5 h-5 text-blue-500" />
              <Label className="text-lg font-medium">Major</Label>
            </div>
            <ReusableDropdown
              name="major`"
              dropdownItems={MAJORS}
              handleChangeItem={(_, value) =>
                handleChangeOption("major", value)
              }
              selectedItem={
                selections.major || userData.flowchartInformation.major || ""
              }
              className="w-full border rounded-lg hover:border-blue-300 transition-colors"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BasicInformation;
