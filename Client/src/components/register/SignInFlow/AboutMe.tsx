import { Label } from "../../../components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/useUserData";
import { useAppSelector } from "@/redux";
import { RootState } from "@/redux/store";

export const labelStyle = "underline text-lg self-center";

const AboutMe = () => {
  const { handleTextChange } = useUserData();
  const { userData } = useAppSelector((state: RootState) => state.user);

  return (
    <div className="flex flex-col justify-center align-middle">
      <LabelInputContainer>
        <Label className={labelStyle}>Bio</Label>
        <Textarea
          name="bio"
          maxLength={300}
          value={userData?.bio || ""}
          placeholder="Tell us about yourself..."
          onChange={(e) => handleTextChange(e)}
          style={{ height: "150px" }}
        />
      </LabelInputContainer>
    </div>
  );
};

export default AboutMe;

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 mb-4">{children}</div>
);
