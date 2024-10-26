import { useAppSelector } from "@/redux";
import { useNavigate } from "react-router-dom";
import { Label } from "../../components/ui/label";
import WeeklyCalendar from "../../components/register/WeeklyCalendar";
import { useUserData } from "@/hooks/useUserData";
import AboutMe from "@/components/register/SignInFlow/AboutMe";
import InterestDropdown from "@/components/register/InterestDropdown";
import Terms from "@/components/register/SignInFlow/Terms";

export const labelStyle = "underline text-lg self-center";

function ProfilePage() {
  const { userType, userId } = useAppSelector((state) => state.auth);
  const { userData } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const { handleSave } = useUserData();

  const handleBackToChat = () => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="flex w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
        <div className="w-full flex flex-col justify-center align-center p-8">
          <h1 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 mb-6 self-center">
            User Profile
          </h1>
          <LabelInputContainer>
            <Label className={labelStyle}>Name</Label>
            <p className="text-sm text-gray-900 dark:text-gray-100 self-center">
              {userData?.name || "N/A"}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={labelStyle}>Email</Label>
            <p className="text-sm text-gray-900 dark:text-gray-100 self-center">
              {userData?.email || "N/A"}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={labelStyle}>User Type</Label>
            <p className="text-sm text-gray-900 dark:text-gray-100 self-center">
              {userType || "N/A"}
            </p>
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className={labelStyle}>Availability</Label>
            <div className="mb-2">
              <WeeklyCalendar />
            </div>
          </LabelInputContainer>
          <AboutMe />
          <InterestDropdown />
          <Terms />

          <div className="flex flex-col">
            <button
              onClick={handleSave}
              className="bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Save
            </button>
            <div className="mt-6">
              <button
                onClick={handleBackToChat}
                className="w-full bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Back to Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 mb-4">{children}</div>
);

export default ProfilePage;
