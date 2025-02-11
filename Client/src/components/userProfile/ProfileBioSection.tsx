import { Label } from "../ui/label";
import { useAppSelector } from "@/redux";
import ProfileBio from "@/components/userProfile/ProfileBio";
import { AnimatedModalDemo } from "@/components/layout/CustomModal";
import AboutMe from "@/components/register/SignInFlow/AboutMe";

export const ProfileBioSection = ({ handleSaveToast }: { handleSaveToast: () => void }) => {
  const { userData } = useAppSelector((state) => state.user);

  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="flex flex-col w-full">
        <Label className="text-2xl font-bold mb-4 block text-center w-full">Bio</Label>
        <ProfileBio bio={userData?.bio} handleSave={handleSaveToast} />
      </div>
      <div className="w-3/4">
        <AnimatedModalDemo onSave={handleSaveToast} title="Modify Bio">
          <AboutMe />
        </AnimatedModalDemo>
      </div>
    </div>
  );
};
