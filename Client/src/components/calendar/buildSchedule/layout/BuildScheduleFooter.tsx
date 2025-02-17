import { Button } from "@/components/ui/button";

const BuildScheduleFooter = ({
  onClick,
  onSaveSchedule,
}: {
  onClick: () => void;
  onSaveSchedule: () => void;
}) => {
  return (
    <>
      <div className="border-t border-gray-200 p-4" />

      <div className="sticky bottom-0 mx-4 bg-background/95 backdrop-blur flex gap-2 shadow-lg p-2">
        {/* Apply Filters button */}
        <Button type="submit" className="w-full shadow-lg" onClick={onClick}>
          Build Schedule
        </Button>
        <Button
          onClick={onSaveSchedule}
          variant="outline"
          className="w-full shadow-lg"
        >
          Save Schedule
        </Button>
      </div>
    </>
  );
};

export default BuildScheduleFooter;
