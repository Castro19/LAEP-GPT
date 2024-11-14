import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../../../components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/useUserData";
import { userActions, useAppDispatch, useAppSelector } from "@/redux";
import { RootState } from "@/redux/store";

const years = [
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "Year 4" },
  { value: "5", label: "Year 5" },
  { value: "6", label: "Year 6" },
];

export const labelStyle = "underline text-lg self-center";

const AboutMe = () => {
  const { handleTextChange } = useUserData();
  const { userData } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col justify-center align-middle">
      <LabelInputContainer>
        <Label className={labelStyle}>Bio</Label>
        <Textarea
          name="bio"
          value={userData?.bio || ""}
          placeholder="Tell us about yourself..."
          onChange={(e) => handleTextChange(e)}
          style={{ height: "150px" }}
        />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label className={labelStyle}>Year</Label>
        <RadioGroup
          value={userData?.year || ""}
          onValueChange={(value) =>
            dispatch(
              userActions.updateUserData({
                ...userData,
                year: value,
                canShareData: userData?.canShareData ?? false,
                availability: userData?.availability ?? null,
                bio: userData?.bio ?? null,
                interests: userData?.interests ?? null,
                name: userData?.name ?? null,
                email: userData?.email ?? null,
                major: userData?.major ?? null,
                userId: userData?.userId ?? "",
              })
            )
          }
        >
          <div className="flex flex-row space-x-4 flex-wrap justify-center gap-y-2">
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

export default AboutMe;

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 mb-4">{children}</div>
);
