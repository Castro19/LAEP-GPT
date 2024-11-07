import { useAppSelector } from "@/redux";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import WeeklyCalendar from "../components/register/WeeklyCalendar";
import { useUserData } from "@/hooks/useUserData";
import AboutMe from "@/components/register/SignInFlow/AboutMe";
import InterestDropdown from "@/components/register/SignInFlow/InterestDropdown";
// import Terms from "@/components/register/SignInFlow/Terms";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnimatedModalDemo } from "@/components/layout/CustomModal";
import Interest from "@/components/userProfile/Interest";
import { useRef } from "react";
import useCalpolyData from "@/hooks/useCalpolyData";

export const labelStyle = "text-lg self-center";

const yearMapping = (year: string) => {
  switch (year) {
    case "1":
      return "1st Year";
    case "2":
      return "2nd Year";
    case "3":
      return "3rd Year";
    case "4":
      return "4th Year";
    case "5":
      return "5th Year";
    case "6":
      return "6th Year";
    default:
      return "N/A";
  }
};
export function ProfilePage() {
  const { userType } = useAppSelector((state) => state.auth);
  const { userData } = useAppSelector((state) => state.user);
  const interestDropdownRef = useRef<HTMLDivElement>(null);
  const classDropdownRef = useRef<HTMLDivElement>(null);
  const { handleSave } = useUserData();
  const { courses, interests } = useCalpolyData();

  const handleSaveToast = () => {
    handleSave();
    toast({
      title: "User Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 border-3 min-h-screen">
      <div className="border border-slate-500 md:col-span-1 md:row-span-4 p-4">
        <Card className="h-full">
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
                {userData?.major || "Computer Science"} {userType || "Student"}
              </p>
            </div>
            <SilverLine />
            <div className="row-span-1">
              <div className="flex flex-col justify-center gap-4">
                <LabelInputContainer>
                  <p className="text-lg text-center font-inter text-white leading-relaxed tracking-tight px-8">
                    {userData?.bio || "N/A"}
                  </p>
                </LabelInputContainer>
                <AnimatedModalDemo onSave={handleSaveToast} title="Modify Bio">
                  <AboutMe />
                </AnimatedModalDemo>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="border border-slate-500 md:col-span-1 md:row-span-1 p-4">
        <Card className="h-full">
          <div className="flex flex-col justify-between h-full py-6">
            <div className="flex flex-col justify-center items-center">
              <Label className="text-2xl font-bold underline justify-self-center p-2">
                Interests
              </Label>
              <Interest interests={userData.interests ?? []} />
            </div>

            <div className="mt-4">
              <AnimatedModalDemo
                onSave={handleSaveToast}
                title="Modify Interests"
                excludeRefs={[interestDropdownRef]}
              >
                <InterestDropdown
                  name="Interests"
                  items={interests}
                  dropdownRef={interestDropdownRef}
                />
              </AnimatedModalDemo>
            </div>
          </div>
        </Card>
      </div>
      <div className="border border-slate-500 md:col-span-1 md:row-span-1 p-4">
        <Card className="h-full">
          <div className="flex flex-col justify-between h-full py-6">
            <div className="flex flex-col justify-center items-center">
              <Label className="text-2xl font-bold underline justify-self-center p-2">
                Courses
              </Label>
              <Interest
                interests={
                  userData.courses.map((course) => course.split(": ")[0]) ?? []
                }
              />
            </div>

            <AnimatedModalDemo
              onSave={handleSaveToast}
              title="Modify Classes"
              excludeRefs={[classDropdownRef]}
            >
              <InterestDropdown
                name="Courses"
                dropdownRef={classDropdownRef}
                items={courses}
              />
            </AnimatedModalDemo>
          </div>
        </Card>
      </div>
      <div className="border border-slate-500 md:col-span-2 md:row-span-2 p-4">
        <Card className="h-full">
          <div className="flex flex-col justify-start h-full py-6">
            <div className="flex justify-center items-center">
              <WeeklyCalendar inReadMode={true} />
            </div>
            <div className="mt-4">
              <AnimatedModalDemo
                onSave={handleSaveToast}
                title="Modify Availability"
              >
                <WeeklyCalendar />
              </AnimatedModalDemo>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col justify-center">{children}</div>
);

const SilverLine = () => (
  <div className="my-16">
    {/* Silver Border */}
    <div className="border border-slate-700"></div>
  </div>
);
