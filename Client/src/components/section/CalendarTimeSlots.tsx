import React from "react";
import { CalendarClassSection } from "../calendar/WeeklyCalendar";
import { Modal, ModalContent } from "../ui/animated-modal";
import { CustomModalBody } from "../ui/animated-modal";
import { CustomModalTriggerButton } from "../ui/animated-modal";

interface CalendarTimeSlotsProps {
  event: CalendarClassSection;
}

const CalendarTimeSlots: React.FC<CalendarTimeSlotsProps> = ({ event }) => {
  const formattedStart = event.start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedEnd = event.end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex items-center justify-start">
      <Modal>
        <CustomModalTriggerButton
          color={event.extendedProps.color}
          className="rounded-md hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="flex flex-col items-start justify-center">
            <div className="text-xs text-gray-700 dark:text-gray-700">
              {formattedStart} - {formattedEnd}
            </div>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-700 truncate">
              {event.extendedProps.courseName}
            </div>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-700">
              {event.title}
            </div>
          </div>
        </CustomModalTriggerButton>
        <CustomModalBody>
          <ModalContent>
            <div>Section Details</div>
          </ModalContent>
        </CustomModalBody>
      </Modal>
    </div>
  );
};

export default CalendarTimeSlots;
