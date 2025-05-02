import { forwardRef } from "react";
import { useAppDispatch } from "@/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  addCustomEvent,
  updateCustomEvent,
  removeCustomEvent,
} from "@/redux/schedule/scheduleSlice";
import {
  Modal,
  ModalContent,
  CustomModalBody,
  CustomModalTriggerButton,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";
import { CustomScheduleEvent } from "@polylink/shared/types";

// Zod schema for validating the custom event form
const CustomEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid start time"),
  end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid end time"),
});

type CustomEventForm = z.infer<typeof CustomEventSchema>;

interface CustomEventSlotProps {
  /** The custom event to display and edit */
  event: CustomScheduleEvent;
}

const CustomEventSlot = forwardRef<HTMLDivElement, CustomEventSlotProps>(
  ({ event }, ref) => {
    const dispatch = useAppDispatch();

    // React Hook Form setup with Zod
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<CustomEventForm>({
      resolver: zodResolver(CustomEventSchema),
      defaultValues: {
        title: event.title,
        start_time: event.meetings[0]?.start_time || "",
        end_time: event.meetings[0]?.end_time || "",
      },
    });

    // On form submit: decide add vs update by checking TEMP- prefix
    const onSubmit = (data: CustomEventForm) => {
      const updated: CustomScheduleEvent = {
        ...event,
        title: data.title,
        meetings: [
          {
            ...event.meetings[0],
            start_time: data.start_time,
            end_time: data.end_time,
          },
        ],
      };

      if (event.id.startsWith("TEMP-")) {
        dispatch(addCustomEvent(updated));
      } else {
        dispatch(updateCustomEvent(updated));
      }
    };

    // Delete event
    const onDelete = () => {
      dispatch(removeCustomEvent(event.id));
    };

    return (
      <div ref={ref} className="flex items-center w-full h-full">
        <Modal>
          <CustomModalTriggerButton
            color={event.color}
            className="rounded-md hover:opacity-90 transition-opacity cursor-pointer min-h-full w-full"
          >
            <div className="p-1 text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
              {event.title}
            </div>
          </CustomModalTriggerButton>

          <CustomModalBody>
            <ModalContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4 p-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Title
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="mt-1 block w-full border rounded-md p-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Start Time
                  </label>
                  <input
                    type="time"
                    {...register("start_time")}
                    className="mt-1 block w-full border rounded-md p-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                  {errors.start_time && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.start_time.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    End Time
                  </label>
                  <input
                    type="time"
                    {...register("end_time")}
                    className="mt-1 block w-full border rounded-md p-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                  {errors.end_time && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.end_time.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {event.id.startsWith("TEMP-") ? "Add" : "Save"}
                  </Button>
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
