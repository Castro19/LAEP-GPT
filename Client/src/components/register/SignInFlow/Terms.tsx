import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/hooks/useUserData";
import { labelStyle } from "@/pages/register/ProfilePage";

export default function Terms() {
  const { userData, handleShareData } = useUserData();

  const description =
    "By accepting these terms, you authorize us to share your data with other users to enhance your experience and facilitate connections within our platform.";
  return (
    <LabelInputContainer>
      <Label className={labelStyle}>Terms of Agreement</Label>
      <p className="text-sm text-gray-900 dark:text-gray-100 mb-4">
        {description}
      </p>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={userData?.canShareData}
          onCheckedChange={(checked) => handleShareData(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100"
        >
          I accept the terms and conditions
        </label>
      </div>
    </LabelInputContainer>
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 my-4">{children}</div>
);
