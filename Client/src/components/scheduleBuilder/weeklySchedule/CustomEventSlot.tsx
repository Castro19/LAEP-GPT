import { forwardRef } from "react";
import { useAppDispatch, scheduleActions } from "@/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ModalContent,
  CustomModalBody,
  CustomModalTriggerButton,
  useModal,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";
import { CustomScheduleEvent } from "@polylink/shared/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DaysSelector, TitleLabel } from "@/components/classSearch";
import { convertTo12HourFormat } from "@/components/classSearch/helpers/timeFormatter";

// Zod schema for validating the custom event form
const CustomEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  days: z
    .array(z.enum(["Mo", "Tu", "We", "Th", "Fr"]))
    .min(1, "At least one day is required"),
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid start time"),
  end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid end time"),
  color: z.string().min(1, "Color is required"),
});

type CustomEventForm = z.infer<typeof CustomEventSchema>;

interface CustomEventSlotProps {
  /** The custom event to display and edit */
  event: CustomScheduleEvent;
}

const CustomEventSlot = forwardRef<HTMLDivElement, CustomEventSlotProps>(
  ({ event }, ref) => {
    const { setOpen } = useModal();
    const dispatch = useAppDispatch();
    const startTime = event.meetings[0]?.start_time
      ? convertTo12HourFormat(event.meetings[0].start_time)
      : "";
    const endTime = event.meetings[0]?.end_time
      ? convertTo12HourFormat(event.meetings[0].end_time)
      : "";
    // React Hook Form setup with Zod
    const form = useForm<CustomEventForm>({
      resolver: zodResolver(CustomEventSchema),
      defaultValues: {
        title: event.title,
        color: event.color,
        days: event.meetings[0]?.days || [],
        start_time: event.meetings[0]?.start_time || "",
        end_time: event.meetings[0]?.end_time || "",
      },
    });

    // On form submit: decide add vs update by checking TEMP- prefix
    const onSubmit = (data: CustomEventForm) => {
      // Create a single meeting with the selected days
      const updated: CustomScheduleEvent = {
        ...event,
        title: data.title,
        color: data.color,
        meetings: [
          {
            days: data.days,
            start_time: data.start_time,
            end_time: data.end_time,
          },
        ],
        isVisible: true,
        isLocked: false,
      };

      dispatch(scheduleActions.upsertCustomEvent(updated));
      setOpen(false); // Close the modal after successful submission
    };

    // Delete event
    const onDelete = () => {
      dispatch(scheduleActions.removeCustomEvent(event.id));
      setOpen(false); // Close the modal after deletion
    };

    return (
      <div ref={ref} className="flex items-center w-full h-full">
        <CustomModalTriggerButton
          color={event.color}
          className="rounded-md hover:opacity-90 transition-opacity cursor-pointer min-h-full w-full"
        >
          <div className="flex flex-col items-start justify-center p-1 sm:p-2 w-full relative">
            <div className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-700 whitespace-nowrap">
              {startTime} - {endTime}
            </div>
            <div className="text-xxs sm:text-sm font-bold text-gray-700 dark:text-gray-700 truncate w-full">
              {event.title}
            </div>
          </div>
        </CustomModalTriggerButton>

        <CustomModalBody>
          <ModalContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4 p-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <TitleLabel title="Days" />
                      <FormControl>
                        <DaysSelector field={field} form={form} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between gap-2">
                  <div className="w-1/2">
                    <FormField
                      control={form.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2">
                    <FormField
                      control={form.control}
                      name="end_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </ModalContent>
        </CustomModalBody>
      </div>
    );
  }
);

CustomEventSlot.displayName = "CustomEventSlot";
export default CustomEventSlot;
