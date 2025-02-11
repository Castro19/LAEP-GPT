import { CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/redux";
import { AnimatedModalDemo } from "@/components/layout/CustomModal";
import BasicInformation from "@/components/register/SignInFlow/BasicInformation";
import { SilverLine } from "./SilverLine";

const yearMapping = (year: string) => {
  switch (year) {
    case "freshman":
      return "Freshman";
    case "sophomore":
      return "Sophomore";
    case "junior":
      return "Junior";
    case "senior":
      return "Senior";
    case "graduate":
      return "Graduate";
    default:
      return "";
  }
};

export const ProfileHeader = ({ handleSaveDegreeInfo }: { handleSaveDegreeInfo: () => void }) => {
    const { userData } = useAppSelector((state) => state.user); 
    const { userType } = useAppSelector((state) => state.auth); 
    

  return (
    <CardContent>
      <div className="flex flex-col justify-around items-center my-2">
        <Avatar className="w-32 h-32 mb-4">
          <AvatarFallback className="bg-slate-300">
            {userData?.name?.charAt(0) || "N/A"}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-3xl font-bold text-center my-2">
          {userData?.name || "N/A"}
        </h3>
        <p className="text-lg text-center">{userData?.email || "N/A"}</p>
        <p className="text-lg text-center mt-2">
          {yearMapping(userData?.year || "N/A")}{" "}
          {userData?.flowchartInformation.major || ""}{" "}
          {userType || "Student"}
        </p>
        {!userData?.flowchartInformation.major && (
          <p className="text-lg text-center mt-2">
            Please update your major to create a flowchart.
          </p>
        )}
      </div>
      <SilverLine />
      <div className="flex flex-col items-center">
        <AnimatedModalDemo onSave={handleSaveDegreeInfo} title="Change Major" className="w-3/4">
          <BasicInformation />
        </AnimatedModalDemo>
      </div>
    </CardContent>
  );
};
