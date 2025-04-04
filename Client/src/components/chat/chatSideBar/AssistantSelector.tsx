import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux";
import { AssistantType } from "@polylink/shared/types";
import { cn } from "@/lib/utils";
import { useToast } from "../../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import AssistantItem, { ListItemAssistant } from "./AssistantItem";

type assistantSelectorProps = {
  onSelect: (model: AssistantType) => void;
};

export default function AssistantSelector({ onSelect }: assistantSelectorProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentModel, assistantList } = useAppSelector(
    (state) => state.assistant
  );
  const { userData } = useAppSelector((state) => state.user);
  const [matchingAssistantLocked, setMatchingAssistantLocked] = useState(true);
  const [flowchartAssistantLocked, setFlowchartAssistantLocked] =
    useState(true);
  const [toastMatchingDescription, setToastMatchingDescription] = useState("");
  const [toastFlowchartDescription, setToastFlowchartDescription] =
    useState("");

  useEffect(() => {
    const { availability, interestAreas } = userData;

    const userHasNoAvailability = Object.values(availability).every(
      (timeSlots) => timeSlots.length === 0
    );
    const userHasNoPrimaryFlowchart =
      !userData.flowchartInformation.flowchartId;

    const matchingAssistantLocked =
      interestAreas.length === 0 || userHasNoAvailability;

    if (interestAreas.length === 0 && !userHasNoAvailability) {
      setToastMatchingDescription("Please update your profile's interestAreas");
    } else if (userHasNoAvailability && interestAreas.length > 0) {
      setToastMatchingDescription("Please update your profile's availability");
    } else {
      setToastMatchingDescription(
        "Please update your profile's interestAreas and availability"
      );
    }
    if (userHasNoPrimaryFlowchart) {
      setToastFlowchartDescription("Please create a primary flowchart");
    }
    setFlowchartAssistantLocked(userHasNoPrimaryFlowchart);
    setMatchingAssistantLocked(matchingAssistantLocked);
  }, [userData]);

  // Transform assistantList to prioritize 'name' over 'title'
  const transformedassistantList = assistantList.map((option) => {
    // Prioritize displaying 'name', fallback to 'title' if 'name' is not available
    const title = option.title || "Unnamed Assistant";
    const description = option.desc || "No description available";

    return {
      id: option.id,
      title,
      desc: description,
      urlPhoto: option.urlPhoto || "", // Default to an empty string if no photo is provided
      locked:
        (title === "Matching Assistant" && matchingAssistantLocked) ||
        (title === "Flowchart Assistant" && flowchartAssistantLocked),
    };
  });

  const handleLockClick = (gpt: AssistantType) => {
    const handleToastAction = () => {
      if (gpt.title === "Matching Assistant") {
        navigate(`/profile/edit`);
      } else if (gpt.title === "Flowchart Assistant") {
        navigate(`/flowchart`);
      }
    };
    toast({
      title: `${gpt.title} is locked`,
      description:
        gpt.title === "Matching Assistant"
          ? toastMatchingDescription
          : toastFlowchartDescription,
      action: (
        <ToastAction altText="Update Profile" onClick={handleToastAction}>
          {gpt.title === "Matching Assistant"
            ? "Update Profile"
            : "Create Flowchart"}
        </ToastAction>
      ),
    });
  };

  const handleAssistantSelect = (option: ListItemAssistant) => {
    if (option.locked) {
      handleLockClick(option);
    } else {
      onSelect(option);
    }
  };

  const otherAssistants = transformedassistantList.filter(
    (assistant) => assistant.id !== currentModel.id
  );

  return (
    <div className="flex flex-col h-full">
      {/* Current Selected Assistant */}
      <div className="flex-grow ml-2 bg-slate-800 rounded-md sticky"> 
        <AssistantItem
          assistant={currentModel as ListItemAssistant}
          onClick={() => handleAssistantSelect(currentModel as ListItemAssistant)}
          className={cn(
            "hover:bg-transparent"
          )}
        />
      </div>
    
      {/* List of Other Assistants */}
      <div className="flex-grow px-1 py-1"> 
        <ul className="space-y-1">
          {otherAssistants.map((option) => (
            <li key={option.id}>
              <AssistantItem
                assistant={option}
                onClick={() => handleAssistantSelect(option)}
                className={cn(
                  option.locked ? "cursor-not-allowed opacity-50" : ""
                )}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
