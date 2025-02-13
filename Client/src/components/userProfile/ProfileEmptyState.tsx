import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type ProfileEmptyStateProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "flowchart" | "calendar";
};

const ProfileEmptyState = ({
  title,
  description,
  icon,
  type,
}: ProfileEmptyStateProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "flowchart") {
      navigate("/flowchart");
    } else if (type === "calendar") {
      navigate("/calendar");
    }
  };
  return (
    <div className="h-full flex items-center justify-center p-6 dark:bg-transparent rounded-lg">
      <div className="max-w-md text-center space-y-6">
        {/* Icon/Illustration */}
        <div className="flex justify-center">
          <div className="w-32 h-32 dark:bg-slate-800 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-4xl font-semibold text-gray-400">{title}</h3>
          <p className="text-gray-200 text-lg">{description}</p>
        </div>
        <Button onClick={handleClick}>Create a {type}</Button>
      </div>
    </div>
  );
};

export default ProfileEmptyState;
