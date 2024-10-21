import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../redux/auth/authSlice"; // Adjust the path
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import WeeklyCalendar from "../../components/register/WeeklyCalendar";
import { Availability } from "@/types";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import InterestDropdown from "@/components/register/InterestDropdown";
import { Button } from "@/components/ui/button";

const underlineStyle = "underline";
const csInterests = [
  "Artificial Intelligence",
  "Cybersecurity",
  "Data Science",
  "Software Engineering",
  "Web Development",
  "Mobile Development",
  "Game Development",
  "Machine Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Virtual Reality",
  "Robotics",
  "Blockchain",
  "Quantum Computing",
  "Augmented Reality",
  "3D Printing",
];

type UserInfo = {
  availability: Availability;
  bio: string | undefined;
  canShareData: boolean;
  interests: string[];
  major: string | undefined;
  userType: string;
  year: string | undefined;
};

function ProfilePage() {
  const { currentUser, userId, loading } = useAppSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState<UserInfo>({
    availability: {} as Availability,
    bio: "",
    canShareData: false,
    interests: [],
    major: "",
    userType: "student",
    year: "",
  });

  useEffect(() => {
    if (!loading && userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:4000/users/${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUserData({
            availability: data?.availability || {},
            bio: data?.bio || "",
            canShareData: data?.canShareData || false,
            interests: data?.interests || [],
            major: data?.major || "",
            userType: data?.userType || "student",
            year: data?.year || "",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [loading, userId]);

  // Handle adding a new interest
  const handleAddInterest = (value: string) => {
    setUserData((prevState: UserInfo) => {
      // Avoid adding duplicates
      if (!prevState.interests.includes(value)) {
        return {
          ...prevState,
          interests: [...prevState.interests, value],
        };
      }
      return prevState;
    });
  };

  // Handle removing an interest
  const handleRemoveInterest = (value: string) => {
    setUserData((prevState) => ({
      ...prevState,
      interests: prevState.interests.filter((interest) => interest !== value),
    }));
  };

  const handleBackToChat = () => {
    navigate("/chat");
  };

  const handleSave = () => {
    dispatch(updateUserProfile(userData));
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
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {currentUser?.displayName || "N/A"}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={underlineStyle}>Email</Label>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {currentUser?.email || "N/A"}
            </p>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={underlineStyle}>User Type</Label>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {userData.userType || "N/A"}
            </p>
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className={underlineStyle}>Availability</Label>
            <div className="mb-2">
              <WeeklyCalendar
                availability={userData.availability}
                onChange={handleAvailabilityChange}
              />
            </div>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={underlineStyle}>About Me</Label>
            <Textarea
              name="bio"
              value={userData.bio || ""}
              placeholder="Tell us about yourself..."
              onChange={handleChange}
              style={{ width: "75%", height: "100px" }}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={underlineStyle}>Year</Label>
            <RadioGroup
              value={userData.year || ""}
              onValueChange={(value) =>
                setUserData({ ...userData, year: value })
              }
            >
              <div className="flex flex-row space-x-4 flex-wrap">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="year1" />
                  <Label htmlFor="year1">Year 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="year2" />
                  <Label htmlFor="year2">Year 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="year3" />
                  <Label htmlFor="year3">Year 3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="year4" />
                  <Label htmlFor="year4">Year 4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="year5" />
                  <Label htmlFor="year5">Year 5</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6" id="year6" />
                  <Label htmlFor="year6">Year 6</Label>
                </div>
              </div>
            </RadioGroup>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className={underlineStyle}>Interests</Label>
            <InterestDropdown
              name="interests"
              labelText="Select an interest"
              handleFunction={handleAddInterest}
              listOfItems={csInterests.sort()}
              selectedValue={""}
            />
          </LabelInputContainer>
          <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap" }}>
            {userData.interests.map((interest, index) => (
              <Button
                key={index}
                onClick={() => handleRemoveInterest(interest)}
                style={{ margin: "5px" }}
              >
                {interest} ✕
              </Button>
            ))}
          </div>
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
