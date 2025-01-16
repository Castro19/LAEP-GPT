import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/hooks/useUserData";
import { useAppDispatch, useAppSelector } from "@/redux";
import { RootState } from "@/redux/store";
import ReusableDropdown from "@/components/ui/reusable-dropdown";
import { MAJORS } from "@/calpolyData/majors";
import { setSelection } from "@/redux/flowSelection/flowSelectionSlice";
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
    <div className="flex flex-col justify-center align-middle">
      <ReusableDropdown
        name="Major"
        dropdownItems={MAJORS}
        handleChangeItem={(_, value) => handleChangeOption("major", value)}
        selectedItem={
          selections.major || userData.flowchartInformation.major || ""
        }
      />
      {showStartingYear && (
        <ReusableDropdown
          name="Starting Year"
          dropdownItems={YEAR_OPTIONS}
          handleChangeItem={(_, value) =>
            handleChangeOption("startingYear", value)
          }
          selectedItem={
            selections.startingYear ||
            userData.flowchartInformation.startingYear ||
            ""
          }
        />
      )}
      <LabelInputContainer>
        <Label className={labelStyle}>Year</Label>
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
        >
          <div className="flex flex-col gap-4 justify-center">
            {years.map((year) => (
              <div key={year.value} className="flex items-center space-x-2">
                <RadioGroupItem value={year.value} id={`year${year.value}`} />
                <Label htmlFor={`year${year.value}`}>{year.label}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </LabelInputContainer>
    </div>
  );
};

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 mb-4">{children}</div>
);

export default BasicInformation;
