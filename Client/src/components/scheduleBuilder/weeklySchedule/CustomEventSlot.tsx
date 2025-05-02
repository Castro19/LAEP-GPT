import React, { forwardRef, useState } from "react";
import {
  Modal,
  ModalContent,
  CustomModalBody,
  CustomModalTriggerButton,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";
import { CustomScheduleEvent } from "@polylink/shared/types";

interface CustomEventSlotProps {
  /** The custom event to display and edit */
  event: CustomScheduleEvent;
  /** Callback when the user saves changes */
  onSave: (updated: CustomScheduleEvent) => void;
}

const CustomEventSlot = forwardRef<HTMLDivElement, CustomEventSlotProps>(
  ({ event, onSave }, ref) => {
    // Local form state for editing
    console.log("EVENT", event);
    const [title, setTitle] = useState(event.title);
    const [startTime, setStartTime] = useState(
      event.meetings[0]?.start_time || ""
    );
    const [endTime, setEndTime] = useState(event.meetings[0]?.end_time || "");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Build a new CustomScheduleEvent with updated values
      const updated: CustomScheduleEvent = {
        ...event,
        title,
        meetings: [
          {
            ...event.meetings[0],
            start_time: startTime,
            end_time: endTime,
          },
        ],
      };
      onSave(updated);
    };

    return (
      <div ref={ref} className="flex items-center w-full h-full">
        <Modal>
          {/* Trigger button shows the event title */}
          <CustomModalTriggerButton
            color={event.color}
            className="rounded-md hover:opacity-90 transition-opacity cursor-pointer min-h-full w-full"
          >
            <div className="p-1 text-sm font-medium text-gray-700 truncate">
              {event.title}
            </div>
          </CustomModalTriggerButton>

          {/* Modal body with a basic edit form */}
          <CustomModalBody>
            <ModalContent>
              <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 block w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 block w-full border rounded-md p-2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="submit">Save</Button>
                  {/* Future: add a Delete button here */}
                </div>
              </form>
            </ModalContent>
          </CustomModalBody>
        </Modal>
      </div>
    );
  }
);

CustomEventSlot.displayName = "CustomEventSlot";
export default CustomEventSlot;
