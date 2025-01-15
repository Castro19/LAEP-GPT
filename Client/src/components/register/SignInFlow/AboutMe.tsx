import { environment } from "@/helpers/getEnvironmentVars";
import { Label } from "../../../components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/useUserData";
import { useAppSelector } from "@/redux";
import { RootState } from "@/redux/store";
import { GiFairyWand } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const labelStyle = "underline text-lg self-center";

const AboutMe = () => {
  const { handleTextChange } = useUserData();
  const { userData } = useAppSelector((state: RootState) => state.user);

  const handleGenerateBio = async () => {
    try {
      // const response = await fetch(
      //   `${import.meta.env.VITE_API_URL}/generate-bio`,
      //   {
      //     method: "POST",
      //     body: JSON.stringify(userData),
      //   }
      // );
      // const data = await response.json();
      // console.log(data);
      console.log("BIO GENERATION NOT IMPLEMENTED YET");
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to generate bio:", error);
      }
    }
  };

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
        <div className="flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="align-self-end justify-self-end dark:bg-transparent dark:text-white hover:dark:bg-transparent hover:text-gray-500 transition-transform hover:scale-110"
                  size="icon"
                  onClick={handleGenerateBio}
                >
                  <GiFairyWand />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate Bio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </LabelInputContainer>
    </div>
  );
};

export default AboutMe;

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2 mb-4">{children}</div>
);
