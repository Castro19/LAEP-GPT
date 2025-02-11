import { Label } from "../ui/label";
import { useAppSelector } from "@/redux";
import Interest from "@/components/userProfile/Interest";
import { AnimatedModalDemo } from "@/components/layout/CustomModal";
import { Interests } from "@/components/register/SignInFlow/Interests";

export const ProfileInterestsSection = ({ handleSaveToast }: { handleSaveToast: () => void }) => {
  const { userData } = useAppSelector((state) => state.user);

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      {userData.interestAreas.length > 0 && (
        <InterestSection title="Interests" data={userData.interestAreas} />
      )}
      {userData.preferredActivities.length > 0 && (
        <InterestSection title="Preferred Activities" data={userData.preferredActivities} />
      )}
      {userData.goals.length > 0 && (
        <InterestSection title="Goals" data={userData.goals} />
      )}

      <div className="flex justify-center items-center mt-8">
        <AnimatedModalDemo onSave={handleSaveToast} title="Modify Interests" className="w-3/4">
          <Interests />
        </AnimatedModalDemo>
      </div>
    </div>
  );
};

const InterestSection = ({ title, data }: { title: string; data: string[] }) => (
  <div className="w-full max-w-2xl shadow-sm">
    <Label className="text-2xl font-bold mb-4 border-b pb-4 border-slate-700 block text-center">
      {title}
    </Label>
    <Interest interestAreas={data.filter((item) => item !== "Other")} />
  </div>
);
