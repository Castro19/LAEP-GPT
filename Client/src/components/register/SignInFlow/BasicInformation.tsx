import { motion } from "framer-motion";

// Redux
import { useAppDispatch, useAppSelector, flowSelectionActions } from "@/redux";

// Hooks
import { useUserData } from "@/hooks/useUserData";

// Environment variables
import { MAJORS } from "@/constants/majors";

// Components
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReusableDropdown from "@/components/ui/reusable-dropdown";

// Icons & UI Components
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
  const { userData } = useAppSelector((state) => state.user);
  const { selections } = useAppSelector((state) => state.flowSelection);

  const dispatch = useAppDispatch();

  const handleChangeOption = (key: string, value: string) => {
    handleChangeFlowchartInformation(
      key as "startingYear" | "catalog" | "major" | "concentration",
      value
    );
    dispatch(
      flowSelectionActions.setSelection({
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
      // Center and add spacing for mobile
      className="w-full max-w-md mx-auto px-2 sm:px-4 my-4 sm:my-6 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
    >
      <Card
        // Keep the existing background color; just add some rounding + shadow
        className="p-4 sm:p-6 space-y-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Basic Information
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Please share some basic information about yourself
          </p>
        </div>

        <div className="space-y-6">
          {/* Starting Year Selection */}
          {showStartingYear && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <RiCalendarLine className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <Label className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                  Starting Year
                </Label>
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
              <RiUserStarLine className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <Label className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                Current Year
              </Label>
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
                      className="text-sm sm:text-base text-gray-700 dark:text-gray-300 cursor-pointer"
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
              <RiGraduationCapLine className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <Label className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                Major
              </Label>
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
