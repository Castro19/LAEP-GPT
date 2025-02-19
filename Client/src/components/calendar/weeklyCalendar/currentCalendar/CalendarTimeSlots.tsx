import React from "react";
import {
  CalendarClassSection,
  CalendarSectionInfo,
} from "@/components/calendar";
import { Modal, ModalContent } from "@/components/ui/animated-modal";
import { CustomModalBody } from "@/components/ui/animated-modal";
import { CustomModalTriggerButton } from "@/components/ui/animated-modal";

// Add 'conflict' as a prop
interface CalendarTimeSlotsProps {
  event: CalendarClassSection;
  conflict?: boolean;
}

const CalendarTimeSlots: React.FC<CalendarTimeSlotsProps> = ({ event }) => {
  /**
   * If `conflict` is true, we add some Tailwind classes for a red/opacity background.
   * You can also do this on the <div> or the <CustomModalTriggerButton>,
   * depending on the exact design you want.
   */

  return (
    <div className="flex items-center justify-start w-full h-full">
      <Modal>
        <CustomModalTriggerButton
          color={event.extendedProps.color}
          className="rounded-md hover:opacity-90 transition-opacity cursor-pointer min-h-full w-full"
        >
          <div className="flex flex-col items-start justify-center p-2">
            <div className="text-xs text-gray-700 dark:text-gray-700">
              {event.extendedProps.start_time} - {event.extendedProps.end_time}
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
          <ModalContent className="dark:bg-slate-950">
            <CalendarSectionInfo />
          </ModalContent>
        </CustomModalBody>
      </Modal>
    </div>
  );
};

export default CalendarTimeSlots;
