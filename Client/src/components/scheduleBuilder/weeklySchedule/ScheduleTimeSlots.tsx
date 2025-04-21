import { forwardRef, useRef } from "react";
import {
  ScheduleClassSection,
  ScheduleSectionInfo,
} from "@/components/scheduleBuilder";
import {
  Modal,
  ModalContent,
  NarrowScreenModal,
} from "@/components/ui/animated-modal";
import { CustomModalBody } from "@/components/ui/animated-modal";
import { CustomModalTriggerButton } from "@/components/ui/animated-modal";
import { convertTo12HourFormat } from "@/components/classSearch/helpers/timeFormatter";
import { formatProfessorNames } from "@/components/scheduleBuilder/helpers";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import NarrowScreenScheduleSectionInfo from "./NarrowScreenScheduleSectionInfo";
// Add 'conflict' as a prop
interface ScheduleTimeSlotsProps {
  event: ScheduleClassSection;
  conflict?: boolean;
  onClick: () => void;
}

const ScheduleTimeSlots = forwardRef<HTMLDivElement, ScheduleTimeSlotsProps>(
  ({ event, onClick }, ref) => {
    const isNarrowScreen = useIsNarrowScreen();
    const modalRef = useRef<HTMLDivElement>(null);
    const startTime = event.extendedProps.start_time
      ? convertTo12HourFormat(event.extendedProps.start_time)
      : "";
    const endTime = event.extendedProps.end_time
      ? convertTo12HourFormat(event.extendedProps.end_time)
      : "";

    const professorNames = formatProfessorNames(event.extendedProps.professors);

    /**
     * If `conflict` is true, we add some Tailwind classes for a red/opacity background.
     * You can also do this on the <div> or the <CustomModalTriggerButton>,
     * depending on the exact design you want.
     */
    return (
      <div ref={ref} className="flex items-center justify-start w-full h-full">
        <Modal>
          <CustomModalTriggerButton
            color={event.extendedProps.color}
            className="rounded-md hover:opacity-90 transition-opacity cursor-pointer min-h-full w-full"
            onClick={onClick}
          >
            <div className="flex flex-col items-start justify-center p-1 sm:p-2 w-full">
              <div className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-700 whitespace-nowrap">
                {startTime} - {endTime}
              </div>
              <div className="text-xxs sm:text-sm font-bold text-gray-700 dark:text-gray-700 truncate w-full">
                {event.title}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-700 truncate w-full">
                {professorNames}
              </div>
            </div>
          </CustomModalTriggerButton>
          {isNarrowScreen ? (
            <NarrowScreenModal ref={modalRef}>
              <NarrowScreenScheduleSectionInfo />
            </NarrowScreenModal>
          ) : (
            <CustomModalBody>
              <ModalContent className="dark:bg-slate-950">
                <ScheduleSectionInfo />
              </ModalContent>
            </CustomModalBody>
          )}
        </Modal>
      </div>
    );
  }
);

ScheduleTimeSlots.displayName = "ScheduleTimeSlots";

export default ScheduleTimeSlots;
