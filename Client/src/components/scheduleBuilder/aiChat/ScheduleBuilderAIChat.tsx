import { useEffect, useRef, useState } from "react";
import { NewChat } from "@/components/chat";
import ChatContainerScheduleBuilder from "./ChatContainerScheduleBuilder";
import ScheduleBuilderLogs from "./ScheduleBuilderLogs";
import { Button } from "@/components/ui/button";
import { IoMdChatboxes } from "react-icons/io";
import {
  useAppDispatch,
  scheduleBuilderLogActions,
  useAppSelector,
} from "@/redux";
import ScheduleBuilderChatInput from "./ScheduleBuilderChatInput";
import { CourseTerm, SectionEssential } from "@polylink/shared/types";
import { useParams } from "react-router-dom";
const ScheduleBuilderAIChat = () => {
  const dispatch = useAppDispatch();
  const { scheduleId } = useParams();
  const { currentSchedule } = useAppSelector((state) => state.schedule);
  console.log("currentSchedule", currentSchedule);
  /* refs for ChatInput – still stubs */
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  /* local UI-state */
  const [showLogs, setShowLogs] = useState(false);

  const onShowScheduleBuilderLogs = () => {
    console.log("show schedule builder logs");
    if (showLogs) {
      setShowLogs(false);
    } else {
      // fetch logs from database
      dispatch(scheduleBuilderLogActions.fetchAllLogs());
      setShowLogs(true);
    }
  };

  useEffect(() => {
    const sectionEssential: SectionEssential[] | undefined =
      currentSchedule?.sections.map((section) => ({
        classNumber: section.classNumber,
        courseId: section.courseId,
        courseName: section.courseName,
        units: section.units,
        instructors: section.professors.map((professor) => ({
          name: professor.name,
          id: professor.id,
          email: "",
        })),
        instructorsWithRatings: [],
        classPair: section.classPair,
        meetings: section.meetings.map((meeting) => ({
          days: meeting.days,
          start_time: meeting.start_time,
          end_time: meeting.end_time,
          location: "",
        })),
      }));
    const state = {
      user_id: "",
      term: "fall2025" as CourseTerm,
      sections: sectionEssential || [],
      user_query: "",
      schedule_id: scheduleId || "",
      diff: { added: [], removed: [] },
      preferences: { with_time_conflicts: true },
    };
    dispatch(scheduleBuilderLogActions.setState(state));
  }, [currentSchedule, scheduleId, dispatch]);

  return (
    <>
      {/* sticky top bar */}
      <header className="sticky top-0 bg-slate-900 text-white p-1 z-40 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
        <div className="flex items-center justify-end gap-2">
          {/* ▸ give the button its own relative wrapper */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={onShowScheduleBuilderLogs}
              aria-label="Show schedule-builder logs"
            >
              <IoMdChatboxes className="w-5 h-5" />
            </Button>

            {/* ▸ panel mounts right next to the button */}
            {showLogs && (
              <ScheduleBuilderLogs onClose={onShowScheduleBuilderLogs} />
            )}
          </div>

          <NewChat />
        </div>
      </header>

      {/* central chat column (≈ ⅓ page width in parent) */}
      <ChatContainerScheduleBuilder />

      {/* bottom composer stub (still separate from the internal one) */}
      <ScheduleBuilderChatInput
        messagesContainerRef={messagesContainerRef}
        textAreaRef={textareaRef}
        sendButtonRef={sendButtonRef}
      />
    </>
  );
};

export default ScheduleBuilderAIChat;
