import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../redux/auth/authSlice"; // Adjust the path
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label"; // Assuming you have a Label component
import WeeklyCalendar from "../../components/register/WeeklyCalendar";
import { Availability } from "@/types";

const underlineStyle = "underline"; // Define a class for underline

function ProfilePage() {
  const { currentUser, userId } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    about: "",
    userType: "",
    availability: {} as Availability,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:4000/users/${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: currentUser?.email || "",
            about: data.about || "",
            userType: data.userType || "",
            availability: data.availability,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleBackToChat = () => {
    navigate("/chat");
  };

  const handleSave = (field: keyof typeof userData) => {
    dispatch(updateUserProfile({ [field]: userData[field] }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAvailabilityChange = (newAvailability: Availability) => {
    setUserData({ ...userData, availability: newAvailability });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="flex w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
        <div className="w-full flex flex-col justify-center p-8">
          <h1 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 mb-6">
            User Profile
          </h1>
          <LabelInputContainer>
            <Label className={underlineStyle}>Name</Label>
            {/* Apply the underline class */}
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {userData.firstName + " " + userData.lastName || "N/A"}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={underlineStyle}>Email</Label>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {userData.email || "N/A"}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={underlineStyle}>User Type</Label>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {userData.userType || "N/A"}
            </p>
          </LabelInputContainer>

          {userData.userType === "teacher" && (
            <LabelInputContainer>
              <Label className={underlineStyle}>About Me</Label>
              <div className="flex flex-col">
                <div className="mb-2">
                  <Textarea
                    name="about"
                    value={userData.about}
                    onChange={handleChange}
                    style={{ resize: "none", height: "100px" }}
                  />
                </div>
                <button
                  onClick={() => handleSave("about")}
                  className="bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </LabelInputContainer>
          )}
          <LabelInputContainer>
            <Label className={underlineStyle}>Availability</Label>
            <div className="flex flex-col">
              <div className="mb-2">
                <WeeklyCalendar
                  availability={userData?.availability || {}} // Parse safely
                  onChange={handleAvailabilityChange}
                />
              </div>
              <button
                onClick={() => handleSave("availability")}
                className="bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </LabelInputContainer>
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
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 mb-4 items-center">{children}</div>
);

export default ProfilePage;
