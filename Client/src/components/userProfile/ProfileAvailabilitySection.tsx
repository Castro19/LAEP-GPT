import WeeklyCalendar from "@/components/register/WeeklyCalendar";
import SpecialButton from "@/components/ui/specialButton";

export const ProfileAvailabilitySection = ({ handleSaveToast }: { handleSaveToast: () => void }) => {
  return (
    <div className="flex flex-col justify-start h-full py-6">
      <div className="flex flex-col justify-center items-center">
        <WeeklyCalendar />
      </div>

      <div className="flex justify-center mt-4">
        <SpecialButton onClick={handleSaveToast} text="Save Availability" />
      </div>
    </div>
  );
};


